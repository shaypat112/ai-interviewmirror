"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    q: "Can I cancel or downgrade my subscription at any time?",
    a: "Yes, absolutely. If you cancel your plan, you will retain access to your tier's features until the exact end of your current billing cycle.",
  },
  {
    q: "How does the Free Trial work?",
    a: "No credit card is required to sign up. You instantly get access to 3 comprehensive AI-graded mock sessions to test out the recording pipeline and metrics panel.",
  },
];

export function PricingFAQ() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="grid gap-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="border-zinc-900 bg-zinc-950/20">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-200">
                {faq.q}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
