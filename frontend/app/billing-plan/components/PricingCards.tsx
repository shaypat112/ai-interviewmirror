"use client";

import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PlanTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  variant: "outline" | "default" | "secondary";
}

const tiers: PlanTier[] = [
  {
    name: "Free Trial",
    price: "$0",
    description: "Perfect for testing the waters and getting initial feedback.",
    features: [
      "3 AI-Graded mock interviews",
      "Basic live audio transcription",
      "Standard posture tracking",
      "7-day history retention",
    ],
    cta: "Start training",
    popular: false,
    variant: "secondary",
  },
  {
    name: "Pro",
    price: "$19",
    description:
      "Our most popular tier for active job hunters looking to level up.",
    features: [
      "Unlimited AI mock interviews",
      "Real-time posture & confidence diagnostics",
      "Advanced filler-word analytics",
      "PDF performance report exports",
      "Priority AI model access",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    variant: "default",
  },
  {
    name: "Premium",
    price: "$49",
    description:
      "Designed for intensive executive preparation and deep analytics.",
    features: [
      "Everything included in Pro",
      "Unlimited video storage cloud history",
      "Custom question bank generation",
      "Comprehensive multi-session behavioral analysis",
      "Dedicated 1-on-1 human review voucher (1/mo)",
    ],
    cta: "Go Premium",
    popular: false,
    variant: "outline",
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-8 md:grid-cols-3 items-start">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          className={`relative border-zinc-800 bg-zinc-950/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 ${
            tier.popular
              ? "border-violet-500/50 bg-zinc-950 ring-1 ring-violet-500/30 shadow-2xl shadow-violet-500/5"
              : ""
          }`}
        >
          {tier.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-violet-600 hover:bg-violet-600 text-white gap-1 px-3 py-0.5 rounded-full text-xs font-medium tracking-wide">
                <Sparkles className="h-3 w-3" /> Most Popular
              </Badge>
            </div>
          )}

          <CardHeader className="space-y-2">
            <CardTitle className="text-xl font-semibold text-white">
              {tier.name}
            </CardTitle>
            <CardDescription className="text-zinc-400 text-xs min-h-[32px]">
              {tier.description}
            </CardDescription>
            <div className="pt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                {tier.price}
              </span>
              <span className="text-sm font-medium text-zinc-500">/month</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Separator className="bg-zinc-800/60" />
            <ul className="space-y-2.5 text-sm text-zinc-300">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              variant={tier.variant}
              className={`w-full rounded-xl font-medium transition-all duration-200 ${
                tier.popular
                  ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/10"
                  : "border-zinc-800 hover:bg-zinc-900 text-zinc-200"
              }`}
            >
              {tier.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
