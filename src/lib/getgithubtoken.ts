// lib/github/getGithubToken.ts
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";

export async function getGithubToken(userId: string): Promise<string> {
    // 1. Check DB first
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { githubAccessToken: true },
    });

    if (user?.githubAccessToken) {
        return decrypt(user.githubAccessToken); // ✅ decrypt on read
    }

    // 2. First time — hit Clerk, then cache it
    const [oauthToken] = await clerkClient.users.getUserOauthAccessToken(
        userId,
        "oauth_github"
    );

    if (!oauthToken?.token) {
        throw new Error("No GitHub token found — user may not have connected GitHub");
    }

    await prisma.user.update({
        where: { id: userId },
        data: { githubAccessToken: encrypt(oauthToken.token) }, // ✅ encrypt on write
    });

    return oauthToken.token;
}