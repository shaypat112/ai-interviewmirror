import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsPageClient } from "@/components/settings/SettingsPageClient";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <SettingsPageClient clerkUserId={userId} />;
}
