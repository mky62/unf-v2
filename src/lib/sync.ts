import { prisma } from "@/src/lib/prisma";
import { fetchGitPublicRepo } from "@/src/lib/github";
import { getGithubToken } from "@/src/lib/getgithubtoken";

const SYNC_TTL_MS = 10 * 60 * 1000; // 30 minutes

export async function syncRepos(
  userId: string,
  opts?: {
    force?: boolean;
  }
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;


  const shouldSync =
    opts?.force ||
    user.syncStatus === "FAILED" ||
    !user.lastSyncedAt ||
    Date.now() - user.lastSyncedAt.getTime() > SYNC_TTL_MS;

  if (!shouldSync) return;

  // atomic lock 
  const lock = await prisma.user.updateMany({
    where: {
      id: userId,
      syncStatus: { not: "SYNCING" }
    },
    data: {
      syncStatus: "SYNCING"
    }
  });

  if (lock.count === 0) return;


  try {
    const token = await getGithubToken(userId); // 👈 get token (DB or Clerk
    const repos = await fetchGitPublicRepo(user.username);

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        repos.map(async (repo) => {
          if (!repo.id || !repo.full_name || !repo.html_url) return;

          const name =
            repo.name ?? String(repo.full_name).split("/").pop() ?? repo.full_name;

          await tx.repo.upsert({
            where: { githubRepoId: repo.id },
            update: {
              userId,
              name,
              fullName: repo.full_name,
              language: repo.language,
              stars: repo.stargazers_count ?? 0,
              htmlUrl: repo.html_url,
              cachedAt: new Date(),
            },
            create: {
              githubRepoId: repo.id,
              userId,
              name,
              fullName: repo.full_name,
              language: repo.language,
              stars: repo.stargazers_count ?? 0,
              htmlUrl: repo.html_url,
            },
          });
        })
      );

      await tx.user.update({
        where: { id: userId },
        data: { syncStatus: "SUCCESS", lastSyncedAt: new Date() },
      });
    });
  } catch (e) {
    await prisma.user.update({
      where: { id: userId },
      data: { syncStatus: "FAILED" },
    });
    throw e;
  }
}

