// app/layout.tsx

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar";
import "./globals.css";

import { Geist } from "next/font/google";
import { AppThemeProvider } from "@/components/AppThemeProvider";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MirAI",
  description:
    "Record yourself answering interview questions and get AI feedback on your performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "font-sans min-h-screen bg-background text-foreground antialiased",
          geist.variable,
        )}
      >
        <body className="min-h-screen bg-background text-foreground antialiased">
          <AppThemeProvider>
            <Navbar />

            {/* Page content sits below the sticky navbar */}

            <div style={{ minHeight: "calc(100dvh - 52px)" }}>{children}</div>
          </AppThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
