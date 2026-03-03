import type { Repo } from "@/src/lib/types";

function requireOk(res: Response, context: string) {
  if (res.ok) return;
  throw new Error(`${context} failed (${res.status})`);
}

export async function fetchPublicRepos(username: string): Promise<Repo[]> {
  const url = `https://api.github.com/users/${encodeURIComponent(
    username
  )}/repos?per_page=100&sort=updated`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  requireOk(res, "GitHub repos fetch");

  const json = (await res.json()) as unknown;
  if (!Array.isArray(json)) return [];
  return json as Repo[];
}

