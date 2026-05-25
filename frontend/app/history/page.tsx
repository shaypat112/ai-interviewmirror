import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HistoryPageClient } from "@/components/history/HistoryPageClient";

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <HistoryPageClient clerkUserId={userId} />;
}
