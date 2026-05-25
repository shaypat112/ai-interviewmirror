"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-white">
          InterviewAI
        </Link>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/history"
                className="text-sm text-slate-400 hover:text-white"
              >
                History
              </Link>
              <Link
                href="/settings"
                className="text-sm text-slate-400 hover:text-white"
              >
                Settings
              </Link>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-white">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
