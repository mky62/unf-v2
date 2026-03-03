import { headers } from "next/headers";
import { Webhook } from "svix";

import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";

type ClerkWebhookEvent = {
  type: string;
  data: unknown;
};

function getGithubUsername(user: unknown): string | null {
  if (!user || typeof user !== "object") return null;

  const accounts = Array.isArray((user as { external_accounts?: unknown }).external_accounts)
    ? ((user as { external_accounts: unknown[] }).external_accounts as unknown[])
    : [];

  const github = accounts.find(
    (a) =>
      !!a &&
      typeof a === "object" &&
      (((a as { provider?: unknown }).provider === "github" ||
        (a as { provider?: unknown }).provider === "oauth_github" ||
        (a as { provider?: unknown }).provider === "oauth_github_enterprise"))
  );

  if (!github || typeof github !== "object") return null;
  const username = (github as { username?: unknown }).username;
  return typeof username === "string" ? username : null;
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });

  const payload = await req.text();
  const h = await headers();

  const svix_id = h.get("svix-id");
  const svix_timestamp = h.get("svix-timestamp");
  const svix_signature = h.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  let evt: ClerkWebhookEvent;
  try {
    const wh = new Webhook(secret);
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const user = evt.data;
    const githubUsername = getGithubUsername(user);

    if (!githubUsername) {
      return new Response("GitHub account not found on user", { status: 400 });
    }

    if (!user || typeof user !== "object") {
      return new Response("Invalid user payload", { status: 400 });
    }

    const userId = (user as { id?: unknown }).id;
    if (typeof userId !== "string" || !userId) {
      return new Response("Invalid user id", { status: 400 });
    }

    const imageUrl = (user as { image_url?: unknown }).image_url;
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        username: githubUsername,
        avatarUrl: typeof imageUrl === "string" ? imageUrl : null,
      },
      create: {
        id: userId,
        stageName: githubUsername,
        username: githubUsername,
        avatarUrl: typeof imageUrl === "string" ? imageUrl : null,
      },
    });
  }

  return new Response("OK", { status: 200 });
}

