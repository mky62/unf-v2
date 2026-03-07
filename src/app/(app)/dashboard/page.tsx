import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BgDash from '@/public/bgdash.jpg'
import Image from 'next/image'

import { prisma } from "@/src/lib/prisma";

import OwnerProfile from "./components/OwnerProfile";
import RepoList from "./components/RepoList";
import ConnectGithub from "./components/ConnectGithub";
import DeleteAccount from "./components/DeleteAccount";
import GithubHeatmap from "@/src/components/GithubHeatmap";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      repos: {
        orderBy: [{ stars: "desc" }, { name: "asc" }],
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
          orderBy: [{ stars: "desc" }, { name: "asc" }],
        },
      },
    });

    if (!user) redirect("/sign-in");
  }

  const data = user;

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden ">
      {/* Premium Background with Overlay */}
      <Image
        src={BgDash}
        alt="bg"
        fill
        className="z-[-1]" />

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="w-[40%] border-2 border-amber-600 p-2 overflow-hidden">

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

          {/* Github Heatmap */}
          <div className="px-2">
            <GithubHeatmap username={data.username} />
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Top panel */}
          <div className="p-2 border-2 border-amber-600 flex-shrink-0">
            <ConnectGithub
              syncStatus={data.syncStatus}
              lastSyncedAt={data.lastSyncedAt?.toISOString() ?? null}
              repoCount={data.repos.length}
            />
          </div>



          {/* Scrollable repo section */}
          <div className="flex-1 p-2 overflow-y-auto min-h-0 border-2 border-amber-600">
            <RepoList repos={data.repos} />
          </div>

        </div>
      </div>
    </div>
  )

  // return (
  //   <div className="min-h-screen bg-background">
  //     <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
  //       {/* Header */}
  //       <div className="mb-8">
  //         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
  //         <p className="mt-1 text-muted-foreground">
  //           Manage your profile and GitHub repositories
  //         </p>
  //       </div>

  //       {/* Sync Controls */}
  //       <ConnectGithub
  //         syncStatus={data.syncStatus}
  //         lastSyncedAt={data.lastSyncedAt?.toISOString() ?? null}
  //         repoCount={data.repos.length}
  //       />

  //       {/* Profile Section */}
  //       <div className="mt-6">
  //         <OwnerProfile
  //           user={{
  //             stageName: data.stageName,
  //             username: data.username,
  //             avatarUrl: data.avatarUrl,
  //             description: data.description,
  //             socialLinks: data.socialLinks,
  //             isPublic: data.isPublic,
  //           }}
  //         />
  //       </div>

  //       {/* Repositories */}
  //       <div className="mt-6">
  //         <RepoList repos={data.repos} />
  //       </div>

  //       {/* Danger Zone */}
  //       <div className="mt-10 rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
  //         <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
  //         <p className="mt-1 text-sm text-muted-foreground">
  //           Permanently delete your account, profile, and all synced repositories.
  //         </p>
  //         <div className="mt-4">
  //           <DeleteAccount />
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
