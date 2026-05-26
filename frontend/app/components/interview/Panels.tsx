"use client";

import { AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { countFillerWords } from "@/hooks/useTranscript";

interface StatusBarProps {
  message: string;
}

export function StatusBar({ message }: StatusBarProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          <Info className="h-4 w-4 text-sky-400" />
          Session Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-400 font-medium">{message}</p>
      </CardContent>
    </Card>
  );
}

interface TranscriptPanelProps {
  transcript: string;
  error?: string | null;
}

export function TranscriptPanel({ transcript, error }: TranscriptPanelProps) {
  const fillerCounts = countFillerWords(transcript);
  const hasFillerWords = Object.keys(fillerCounts).length > 0;

  return (
    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-200 tracking-wide">
          Live Transcript
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-slate-300 pt-1 font-normal">
          {transcript || "Transcript will appear here during recording."}
        </CardDescription>
      </CardHeader>

      {/* Render error or analytics if they exist */}
      {(error || hasFillerWords) && (
        <CardContent className="space-y-4 pt-0">
          <Separator className="bg-white/5" />

          {/* Clean Error Display */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Filler Word Badges */}
          {hasFillerWords && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Filler Words Analytics
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(fillerCounts).map(([word, count]) => {
                  const isHighFrequency = count >= 3;
                  return (
                    <Badge
                      key={word}
                      variant={isHighFrequency ? "destructive" : "secondary"}
                      className={`rounded-full px-3 py-0.5 text-xs font-medium font-mono ${
                        !isHighFrequency &&
                        "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/15"
                      }`}
                    >
                      {word} <span className="ml-1 opacity-70">({count})</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
