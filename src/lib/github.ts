
export type Repo = {
    id: number
    full_name: string
    name?: string
    html_url?: string
    stargazers_count: number
    open_issues_count?: number
    language: string | null
    pushed_at?: string
}

function requireOk(res: Response, context: string) {
    if (res.ok) return;
    throw new Error(`${context} failed (${res.status})`);
}

// export async function fetchPublicRepos(username: string): Promise<Repo[]> {
//   const url = `https://api.github.com/users/${encodeURIComponent(
//     username
//   )}/repos?per_page=100&sort=updated`;

//   const res = await fetch(url, {
//     method: "GET",
//     headers: {
//       Accept: "application/vnd.github+json",
//     },
//     cache: "no-store",
//   });

//   requireOk(res, "GitHub repos fetch");

//   const json = (await res.json()) as unknown;
//   if (!Array.isArray(json)) return [];
//   return json as Repo[];
// }

export async function fetchGitPublicRepo(username: string, token?: string): Promise<Repo[]> {
    const url = `https://api.github.com/users${encodeURIComponent(username)
        }/repos?per_page=100&sort=updated`;

    const headers: any = {
        Accept: "application/vnd.github+json",
    };


    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
    });

    requireOk(res, "Github repos fetch");

    const json = (await res.json()) as unknown;
    if (!Array.isArray(json)) return [];
    return json as Repo[];


}


