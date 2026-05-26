"use client";

import { Badge } from "@/components/ui/badge";

export function PricingHeader() {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <Badge
        variant="secondary"
        className="bg-zinc-900 text-zinc-400 border-zinc-800 px-3 py-1 text-xs rounded-full"
      >
        Interview Plans
      </Badge>
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Simple Pricing
      </h1>
      <p className="max-w-md text-base text-zinc-400">
        Start honing your interview performance today. Zero hidden fees. Cancel
        anytime.
      </p>
    </div>
  );
}
