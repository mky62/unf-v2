import { prisma } from "@/src/lib/prisma";
import { fetchPublicRepos } from "@/src/lib/github";
import type { Repo as GithubRepo } from "@/src/lib/types";

const SYNC_TTL_MS = 10 * 60 * 1000; // 10 minutes

type GithubRepoExtended = GithubRepo & {
  fork?: boolean;
  archived?: boolean;
  homepage?: string | null;
};

export async function syncRepos(
  userId: string,
  opts?: {
    force?: boolean;
  }
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  if (user.syncStatus === "SYNCING") return;

  const isStale =
    !user.lastSyncedAt ||
    Date.now() - user.lastSyncedAt.getTime() > SYNC_TTL_MS;

  if (!opts?.force && !isStale) return;

  await prisma.user.update({
    where: { id: userId },
    data: { syncStatus: "SYNCING" },
  });

  try {
    const repos = (await fetchPublicRepos(user.username)) as GithubRepoExtended[];

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
              description: repo.description,
              language: repo.language,
              stars: repo.stargazers_count ?? 0,
              forks: repo.forks_count ?? 0,
              htmlUrl: repo.html_url,
              homepageUrl: repo.homepage ?? null,
              isFork: !!repo.fork,
              isArchived: !!repo.archived,
              cachedAt: new Date(),
            },
            create: {
              githubRepoId: repo.id,
              userId,
              name,
              fullName: repo.full_name,
              description: repo.description,
              language: repo.language,
              stars: repo.stargazers_count ?? 0,
              forks: repo.forks_count ?? 0,
              htmlUrl: repo.html_url,
              homepageUrl: repo.homepage ?? null,
              isFork: !!repo.fork,
              isArchived: !!repo.archived,
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

