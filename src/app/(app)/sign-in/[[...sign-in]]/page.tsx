import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignInForm from "@/src/components/auth/SignInForm";

export default async function Page() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return <SignInForm />;
}
