import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { prisma } from "@/src/lib/prisma";
import { syncRepos } from "@/src/lib/sync";

import PublicProfile from "./components/PublicProfile";
import PublicRepoList from "./components/PublicRepoList";
import OwnerControls from "./components/OwnerControls";

export const runtime = "nodejs";

export default async function StageNamePage({
  params,
}: {
  params: { stageName: string };
}) {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: { stageName: params.stageName },
    include: {
      repos: {
        orderBy: [{ stars: "desc" }, { forks: "desc" }, { name: "asc" }],
      },
    },
  });

  if (!user) notFound();

  const isOwner = userId === user.id;
  if (!user.isPublic && !isOwner) notFound();

  if (isOwner) {
    await syncRepos(user.id);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8">
      <PublicProfile user={user} isOwner={isOwner} />
      {isOwner ? (
        <OwnerControls
          stageName={user.stageName}
          syncStatus={user.syncStatus}
          lastSyncedAt={user.lastSyncedAt?.toISOString() ?? null}
        />
      ) : null}
      <PublicRepoList repos={user.repos} />
    </div>
  );
}

