"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

interface AuthGateModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export function AuthGateModal({
  isOpen,
  onDismiss,
}: AuthGateModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8">
        <h2 className="text-2xl font-bold text-white">Keep your streak going</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          You&apos;ve used your 3 free analyses. Create a free account to keep
          practicing, save your history, and track your improvement over time.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <SignUpButton mode="modal">
            <button className="w-full rounded-full bg-violet-500 py-3 text-sm font-semibold text-white">
              Create Free Account
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="w-full rounded-full bg-white/10 py-3 text-sm font-medium text-white">
              Sign In
            </button>
          </SignInButton>
          <button
            onClick={onDismiss}
            className="text-sm text-slate-500 hover:text-slate-400"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
