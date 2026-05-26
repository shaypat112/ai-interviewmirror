"use client";
import * as React from "react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isSignedIn } = useUser();
  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          InterviewAI
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <Link
                href="/history"
                className="text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md text-sm font-medium"
              >
                History
              </Link>
              <Link
                href="/settings"
                className="text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md text-sm font-medium"
              >
                Settings
              </Link>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button variant="outline" className="font-semibold px-4 py-2">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
