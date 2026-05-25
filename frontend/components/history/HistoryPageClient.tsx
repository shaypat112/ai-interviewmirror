"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

interface SessionRecord {
  id: string;
  question: string;
  transcript: string;
  score: number;
  improvements: string[];
  exampleAnswer: string;
  category: string;
  difficulty: string;
  createdAt: string;
}

interface HistoryPageClientProps {
  clerkUserId: string;
}

function scoreTone(score: number) {
  if (score >= 8) {
    return "bg-emerald-500/15 text-emerald-300";
  }

  if (score >= 5) {
    return "bg-amber-500/15 text-amber-200";
  }

  return "bg-rose-500/15 text-rose-300";
}

export function HistoryPageClient({ clerkUserId }: HistoryPageClientProps) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/sessions?clerkUserId=${encodeURIComponent(clerkUserId)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load sessions");
        }

        const data = (await response.json()) as SessionRecord[];
        setSessions(data);
      } catch {
        setError("Could not load your session history yet.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadSessions();
  }, [clerkUserId]);

  const summary = useMemo(() => {
    if (sessions.length === 0) {
      return {
        averageScore: 0,
        totalSessions: 0,
        topCategory: "No sessions yet",
      };
    }

    const averageScore =
      sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length;

    const categoryCounts = sessions.reduce<Record<string, number>>((acc, session) => {
      acc[session.category] = (acc[session.category] ?? 0) + 1;
      return acc;
    }, {});

    const topCategory =
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "No sessions yet";

    return {
      averageScore,
      totalSessions: sessions.length,
      topCategory,
    };
  }, [sessions]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_30%),linear-gradient(180deg,_#0a0f1f_0%,_#050816_100%)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-surface p-5">
            <p className="text-sm text-slate-400">Average score</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {summary.averageScore.toFixed(1)}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-surface p-5">
            <p className="text-sm text-slate-400">Total sessions</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {summary.totalSessions}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-surface p-5">
            <p className="text-sm text-slate-400">Most practiced category</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {summary.topCategory}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-surface p-6">
          <h1 className="text-2xl font-semibold text-white">Session history</h1>
          <p className="mt-2 text-sm text-slate-400">
            Review earlier practice runs, transcripts, and AI suggestions.
          </p>

          {isLoading ? (
            <p className="mt-6 text-sm text-slate-400">Loading history...</p>
          ) : error ? (
            <p className="mt-6 text-sm text-rose-300">{error}</p>
          ) : sessions.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">
              No saved sessions yet. Analyze a signed-in practice answer to add
              your first one.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {sessions.map((session) => {
                const expanded = expandedId === session.id;

                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() =>
                      setExpandedId(expanded ? null : session.id)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-medium text-white">
                          {session.question.length > 80
                            ? `${session.question.slice(0, 80)}...`
                            : session.question}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          {session.category} · {session.difficulty} ·{" "}
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreTone(
                          session.score,
                        )}`}
                      >
                        {session.score}/10
                      </span>
                    </div>

                    {expanded ? (
                      <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Transcript
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {session.transcript}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Improvements
                          </p>
                          <ul className="mt-2 space-y-2">
                            {session.improvements.map((improvement) => (
                              <li
                                key={improvement}
                                className="text-sm text-slate-300"
                              >
                                - {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Example answer
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {session.exampleAnswer}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
