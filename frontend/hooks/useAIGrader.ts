import { useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export interface AIFeedback {
  score: number;
  improvements: string[];
  exampleAnswer: string;
}

interface AnalyzeParams {
  question: string;
  transcript: string;
  clerkUserId?: string;
  category?: string;
  difficulty?: string;
}

export function useAIGrader() {
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze({
    question,
    transcript,
    clerkUserId,
    category,
    difficulty,
  }: AnalyzeParams) {
    if (!question.trim() || !transcript.trim()) {
      setError("A question and transcript are both needed before analyzing.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      setFeedback(null);

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          transcript,
          clerkUserId,
          category,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = (await response.json()) as AIFeedback;
      setFeedback(data);
    } catch (err) {
      setError(`Analysis error: ${err}`);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function resetFeedback() {
    setFeedback(null);
    setError(null);
  }

  return {
    feedback,
    isAnalyzing,
    error,
    analyze,
    resetFeedback,
  };
}
