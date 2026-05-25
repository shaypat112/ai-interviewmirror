import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { ThemeSync } from "@/components/ThemeSync";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Interview Mirror",
  description:
    "Record interview answers, review transcripts, and get AI coaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased" data-theme="dark">
        <body className="min-h-full bg-background text-foreground">
          <ThemeSync />
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
