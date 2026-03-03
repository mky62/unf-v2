import { redirect } from "next/navigation";

export default function Page({ params }: { params: { usename: string } }) {
  redirect(`/${params.usename}`);
}

