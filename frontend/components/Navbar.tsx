"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-border bg-background/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-primary">
          MirAI
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <Link
                href="/history"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                History
              </Link>
              <Link
                href="/settings"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Settings
              </Link>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
