import { useState } from "react";
import type { Question, Difficulty } from "@/app/data/questions";
import { questions } from "@/app/data/questions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// ── Types ──────────────────────────────────────────────────────

export type SimulationPhase =
  | "setup"       // difficulty picker
  | "question"    // recording an answer
  | "analyzing"   // waiting for AI on the final question
  | "report";     // final results screen

export interface QuestionResult {
  question: Question;
  transcript: string;
  score: number;
  improvements: string[];
  exampleAnswer: string;
  duration: number; // seconds taken to answer
}

// ── Hook ───────────────────────────────────────────────────────

export function useSimulation() {
  const [phase, setPhase] = useState<SimulationPhase>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick 4 questions: 2 behavioral + 2 technical, matching difficulty
  function buildQuestionSet(diff: Difficulty): Question[] {
    const behavioral = questions.filter(
      (q) => q.category === "Behavioral" && q.difficulty === diff
    );
    const technical = questions.filter(
      (q) => q.category !== "Behavioral" && q.difficulty === diff
    );

    // Shuffle helper — Fisher-Yates algorithm
    function shuffle<T>(arr: T[]): T[] {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    // If not enough questions at this difficulty, fall back to any difficulty
    const bPool = behavioral.length >= 2 ? behavioral : questions.filter(q => q.category === "Behavioral");
    const tPool = technical.length >= 2 ? technical : questions.filter(q => q.category !== "Behavioral");

    return [
      ...shuffle(bPool).slice(0, 2),
      ...shuffle(tPool).slice(0, 2),
    ];
  }

  function startSimulation(diff: Difficulty) {
    const picked = buildQuestionSet(diff);
    setDifficulty(diff);
    setSessionQuestions(picked);
    setCurrentIndex(0);
    setResults([]);
    setError(null);
    setPhase("question");
  }

  // Called after user stops recording on each question
  async function submitAnswer(transcript: string, duration: number) {
    const question = sessionQuestions[currentIndex];
    if (!question) return;

    const isLastQuestion = currentIndex === sessionQuestions.length - 1;

    // On last question show analyzing state while we wait for all AI calls
    if (isLastQuestion) setPhase("analyzing");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          transcript,
          category: question.category,
          difficulty: question.difficulty,
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();

      const result: QuestionResult = {
        question,
        transcript,
        score: data.score,
        improvements: data.improvements,
        exampleAnswer: data.exampleAnswer,
        duration,
      };

      const updatedResults = [...results, result];
      setResults(updatedResults);

      if (isLastQuestion) {
        setPhase("report");
      } else {
        setCurrentIndex((i) => i + 1);
      }
    } catch {
      setError("AI analysis failed. Check your backend.");
      if (isLastQuestion) setPhase("question"); // let them retry
    } finally {
      setIsSubmitting(false);
    }
  }

  function reset() {
    setPhase("setup");
    setSessionQuestions([]);
    setCurrentIndex(0);
    setResults([]);
    setError(null);
  }

  const overallScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0;

  return {
    phase,
    difficulty,
    setDifficulty,
    sessionQuestions,
    currentIndex,
    currentQuestion: sessionQuestions[currentIndex] ?? null,
    results,
    overallScore,
    isSubmitting,
    error,
    startSimulation,
    submitAnswer,
    reset,
    totalQuestions: 4,
  };
}