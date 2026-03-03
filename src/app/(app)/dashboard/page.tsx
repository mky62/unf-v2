import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import { syncRepos } from "@/src/lib/sync";

import OwnerProfile from "./components/OwnerProfile";
import RepoList from "./components/RepoList";
import ConnectGithub from "./components/ConnectGithub";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      repos: {
        orderBy: [{ stars: "desc" }, { forks: "desc" }, { name: "asc" }],
      },
    },
  });

  // Auto-create the DB user if they exist in Clerk but not in the database
  // (e.g., after a database reset or if the webhook didn't fire)
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    const githubAccount = clerkUser.externalAccounts?.find(
      (a) =>
        a.provider === "github" ||
        a.provider === "oauth_github" ||
        a.provider === "oauth_github_enterprise"
    );

    const githubUsername = githubAccount?.username ?? clerkUser.username;
    if (!githubUsername) redirect("/sign-in");

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        username: githubUsername,
        avatarUrl: clerkUser.imageUrl ?? null,
      },
      create: {
        id: userId,
        stageName: githubUsername,
        username: githubUsername,
        avatarUrl: clerkUser.imageUrl ?? null,
      },
    });

    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        repos: {
          orderBy: [{ stars: "desc" }, { forks: "desc" }, { name: "asc" }],
        },
      },
    });

    if (!user) redirect("/sign-in");
  }

  // Auto-sync if repos are stale
  await syncRepos(user.id);

  // Re-fetch after potential sync to get latest data
  const freshUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      repos: {
        orderBy: [{ stars: "desc" }, { forks: "desc" }, { name: "asc" }],
      },
    },
  });

  const data = freshUser ?? user;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your profile and GitHub repositories
          </p>
        </div>

        {/* Sync Controls */}
        <ConnectGithub
          syncStatus={data.syncStatus}
          lastSyncedAt={data.lastSyncedAt?.toISOString() ?? null}
          repoCount={data.repos.length}
        />

        {/* Profile Section */}
        <div className="mt-6">
          <OwnerProfile
            user={{
              stageName: data.stageName,
              username: data.username,
              avatarUrl: data.avatarUrl,
              description: data.description,
              socialLinks: data.socialLinks,
              isPublic: data.isPublic,
            }}
          />
        </div>

        {/* Repositories */}
        <div className="mt-6">
          <RepoList repos={data.repos} />
        </div>
      </div>
    </div>
  );
}
