import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stageName: true },
  });

  if (!user) redirect("/sign-in");
  redirect(`/${user.stageName}`);
}

