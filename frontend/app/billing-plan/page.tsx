"use client";

import { PricingCards } from "./components/PricingCards";
import { PricingFAQ } from "./components/PricingFAQ";
import { PricingHeader } from "./components/PricingHeader";

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-violet-500/30">
      <div className="mx-auto max-w-6xl px-6 py-20 space-y-20">
        <PricingHeader />
        <PricingCards />
        <PricingFAQ />
      </div>
    </div>
  );
}
