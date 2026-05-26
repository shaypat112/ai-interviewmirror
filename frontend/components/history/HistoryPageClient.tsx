"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

// ── Helpers ────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const style =
    score >= 8
      ? {
          background: "var(--green-dim)",
          color: "var(--green)",
          border: "1px solid rgba(34,197,94,0.2)",
        }
      : score >= 5
        ? {
            background: "var(--yellow-dim)",
            color: "var(--yellow)",
            border: "1px solid rgba(245,158,11,0.2)",
          }
        : {
            background: "var(--red-dim)",
            color: "var(--red)",
            border: "1px solid rgba(239,68,68,0.2)",
          };

  return (
    <span
      className="badge"
      style={{
        ...style,
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        fontSize: "12px",
      }}
    >
      {score}/10
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const style =
    difficulty === "Easy"
      ? { background: "var(--green-dim)", color: "var(--green)" }
      : difficulty === "Medium"
        ? { background: "var(--yellow-dim)", color: "var(--yellow)" }
        : { background: "var(--red-dim)", color: "var(--red)" };
  return (
    <span className="badge" style={style}>
      {difficulty}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <p className="label" style={{ marginBottom: "10px" }}>
        {label}
      </p>
      <p
        style={{
          fontSize: "28px",
          fontWeight: 600,
          color: "var(--text-1)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  );
}

// Skeleton row for loading state
function SkeletonRow() {
  return (
    <TableRow style={{ borderColor: "var(--border)" }}>
      {[200, 80, 80, 80, 60].map((w, i) => (
        <TableCell key={i}>
          <div
            className="skeleton"
            style={{ height: "14px", width: `${w}px`, borderRadius: "6px" }}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ── Main Component ─────────────────────────────────────────────

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
        if (!response.ok) throw new Error("Failed to load sessions");
        const data = (await response.json()) as SessionRecord[];
        setSessions(data);
      } catch {
        setError("Could not load your session history.");
      } finally {
        setIsLoading(false);
      }
    }
    void loadSessions();
  }, [clerkUserId]);

  const summary = useMemo(() => {
    if (sessions.length === 0) {
      return { averageScore: "—", totalSessions: 0, topCategory: "—" };
    }
    const avg = sessions.reduce((s, r) => s + r.score, 0) / sessions.length;
    const cats = sessions.reduce<Record<string, number>>((acc, s) => {
      acc[s.category] = (acc[s.category] ?? 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    return {
      averageScore: avg.toFixed(1),
      totalSessions: sessions.length,
      topCategory: top,
    };
  }, [sessions]);

  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px" }}>
      <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
        {/* Page header */}
        <div style={{ marginBottom: "32px" }} className="animate-fade-in">
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "var(--text-1)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Session History
          </h1>
        </div>

        {/* Stats row */}
        <div
          className="animate-fade-in"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "24px",
            animationDelay: "0.05s",
          }}
        >
          <StatCard label="Average Score" value={summary.averageScore} />
          <StatCard label="Total Sessions" value={summary.totalSessions} />
          <StatCard label="Top Category" value={summary.topCategory} />
        </div>

        {/* Table card */}
        <div
          className="animate-fade-in"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            overflow: "hidden",
            animationDelay: "0.1s",
          }}
        >
          <Table>
            <TableHeader>
              <TableRow
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface-2)",
                }}
              >
                {["Question", "Category", "Difficulty", "Date", "Score"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      style={{
                        color: "var(--text-3)",
                        fontSize: "11px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "12px 16px",
                        borderColor: "var(--border)",
                      }}
                    >
                      {h}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading skeletons */}
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}

              {/* Error */}
              {!isLoading && error && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{ padding: "32px 16px", textAlign: "center" }}
                  >
                    <p style={{ color: "var(--red)", fontSize: "14px" }}>
                      {error}
                    </p>
                  </TableCell>
                </TableRow>
              )}

              {/* Empty state */}
              {!isLoading && !error && sessions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{ padding: "48px 16px", textAlign: "center" }}
                  >
                    <p style={{ color: "var(--text-3)", fontSize: "14px" }}>
                      No sessions yet. Complete a practice run to see your
                      history here.
                    </p>
                  </TableCell>
                </TableRow>
              )}

              {/* Actual rows */}
              {!isLoading &&
                !error &&
                sessions.map((session) => {
                  const isExpanded = expandedId === session.id;
                  const parsedImprovements =
                    typeof session.improvements === "string"
                      ? JSON.parse(session.improvements)
                      : session.improvements;

                  return (
                    <>
                      {/* Main data row */}
                      <TableRow
                        key={session.id}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : session.id)
                        }
                        style={{
                          borderColor: "var(--border)",
                          cursor: "pointer",
                          background: isExpanded
                            ? "var(--surface-2)"
                            : "transparent",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.background =
                              "var(--surface-1)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {/* Question — truncated */}
                        <TableCell
                          style={{
                            padding: "14px 16px",
                            color: "var(--text-1)",
                            fontSize: "13px",
                            maxWidth: "360px",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {/* Expand chevron */}
                            <span
                              style={{
                                color: "var(--text-3)",
                                fontSize: "10px",
                                transition: "transform 0.2s",
                                transform: isExpanded
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                flexShrink: 0,
                              }}
                            >
                              ▶
                            </span>
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {session.question.length > 72
                                ? `${session.question.slice(0, 72)}…`
                                : session.question}
                            </span>
                          </span>
                        </TableCell>

                        {/* Category */}
                        <TableCell style={{ padding: "14px 16px" }}>
                          <span
                            className="badge badge-accent"
                            style={{ fontSize: "11px" }}
                          >
                            {session.category}
                          </span>
                        </TableCell>

                        {/* Difficulty */}
                        <TableCell style={{ padding: "14px 16px" }}>
                          <DifficultyBadge difficulty={session.difficulty} />
                        </TableCell>

                        {/* Date */}
                        <TableCell
                          style={{
                            padding: "14px 16px",
                            color: "var(--text-3)",
                            fontSize: "12px",
                            fontFamily: "var(--font-mono)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(session.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </TableCell>

                        {/* Score */}
                        <TableCell style={{ padding: "14px 16px" }}>
                          <ScoreBadge score={session.score} />
                        </TableCell>
                      </TableRow>

                      {/* Expanded detail row */}
                      {isExpanded && (
                        <TableRow
                          key={`${session.id}-expanded`}
                          style={{ borderColor: "var(--border)" }}
                        >
                          <TableCell
                            colSpan={5}
                            style={{
                              padding: "0",
                              background: "var(--bg-subtle)",
                              borderTop: "1px solid var(--border)",
                            }}
                          >
                            <div
                              className="animate-fade-in-fast"
                              style={{
                                padding: "24px",
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: "24px",
                              }}
                            >
                              {/* Transcript */}
                              <div>
                                <p
                                  className="label"
                                  style={{ marginBottom: "10px" }}
                                >
                                  Your Answer
                                </p>
                                <p
                                  style={{
                                    fontSize: "12px",
                                    lineHeight: "1.7",
                                    color: "var(--text-2)",
                                  }}
                                >
                                  {session.transcript ||
                                    "No transcript recorded."}
                                </p>
                              </div>

                              {/* Improvements */}
                              <div>
                                <p
                                  className="label"
                                  style={{ marginBottom: "10px" }}
                                >
                                  What to Improve
                                </p>
                                <ul
                                  style={{
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                  }}
                                >
                                  {parsedImprovements.map(
                                    (item: string, i: number) => (
                                      <li
                                        key={i}
                                        style={{
                                          display: "flex",
                                          gap: "8px",
                                          fontSize: "12px",
                                          color: "var(--text-2)",
                                          marginBottom: "8px",
                                          lineHeight: "1.5",
                                        }}
                                      >
                                        <span
                                          style={{
                                            marginTop: "5px",
                                            width: "5px",
                                            height: "5px",
                                            borderRadius: "99px",
                                            background: "var(--yellow)",
                                            flexShrink: 0,
                                          }}
                                        />
                                        {item}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>

                              {/* Example answer */}
                              <div>
                                <p
                                  className="label"
                                  style={{ marginBottom: "10px" }}
                                >
                                  Example Answer
                                </p>
                                <p
                                  style={{
                                    fontSize: "12px",
                                    lineHeight: "1.7",
                                    color: "var(--text-2)",
                                    fontStyle: "italic",
                                    padding: "12px",
                                    background: "var(--surface-2)",
                                    borderRadius: "10px",
                                    border: "1px solid var(--border)",
                                  }}
                                >
                                  {session.exampleAnswer}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
