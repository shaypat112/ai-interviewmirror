"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Category, Difficulty, Question } from "@/app/data/questions";
import { useQuestionPicker } from "@/hooks/useQuestionPicker";
import { API_BASE_URL } from "@/lib/config";

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Hard: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
};

const categoryStyles: Record<Category, string> = {
  "Arrays & Hashing": "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
  "Linked Lists":
    "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  "Trees & Graphs": "bg-green-500/15 text-green-400 border border-green-500/30",
  "Dynamic Programming":
    "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  "Sorting & Searching": "bg-sky-500/15 text-sky-400 border border-sky-500/30",
  Behavioral: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
};

interface PreferencesResponse {
  preferredDifficulty: Difficulty;
  preferredCategories: Category[];
  showHints: boolean;
}

interface QuestionPickerProps {
  onQuestionSelect: (question: Question) => void;
  onQuestionClear?: () => void;
}

export function QuestionPicker({
  onQuestionSelect,
  onQuestionClear,
}: QuestionPickerProps) {
  const { user, isSignedIn } = useUser();
  const {
    categories,
    selectedCategory,
    currentQuestion,
    difficultyFilter,
    setDifficultyFilter,
    noMatchMessage,
    pickRandomQuestion,
    reset,
  } = useQuestionPicker();
  const [allowedCategories, setAllowedCategories] = useState<Category[]>([]);
  const [showHints, setShowHints] = useState(true);

  useEffect(() => {
    async function loadPreferences() {
      if (!isSignedIn || !user?.id) {
        setAllowedCategories([]);
        setShowHints(true);
        setDifficultyFilter("All");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/preferences/${user.id}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load preferences");
        }

        const data = (await response.json()) as PreferencesResponse;
        setAllowedCategories(data.preferredCategories);
        setShowHints(data.showHints);
        setDifficultyFilter(data.preferredDifficulty ?? "Medium");
      } catch {
        setAllowedCategories([]);
      }
    }

    void loadPreferences();
  }, [isSignedIn, setDifficultyFilter, user?.id]);

  const visibleCategories = useMemo(() => {
    if (allowedCategories.length === 0) {
      return categories;
    }

    return categories.filter((category) => allowedCategories.includes(category));
  }, [allowedCategories, categories]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold text-white">Pick a Category</h2>
      <p className="mt-1 text-sm text-slate-400">
        Select a topic and get a random interview question.
      </p>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Difficulty
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {(["All", "Easy", "Medium", "Hard"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setDifficultyFilter(option)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                difficultyFilter === option
                  ? "bg-white text-slate-950"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={() => pickRandomQuestion(category, onQuestionSelect)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${categoryStyles[category]} ${
              selectedCategory === category
                ? "ring-2 ring-white/40 ring-offset-1 ring-offset-transparent"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {showHints ? (
        <p className="mt-4 text-sm text-slate-400">
          Tip: take a moment to outline your answer and aim for a clear
          60-to-90-second response.
        </p>
      ) : null}

      {noMatchMessage ? (
        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          {noMatchMessage}
        </div>
      ) : null}

      {currentQuestion ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${categoryStyles[currentQuestion.category]}`}
            >
              {currentQuestion.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyStyles[currentQuestion.difficulty]}`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>

          <p className="mt-4 text-base leading-7 text-slate-100">
            {currentQuestion.question}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() =>
                pickRandomQuestion(currentQuestion.category, onQuestionSelect)
              }
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              New Question
            </button>
            <button
              onClick={() => {
                reset();
                onQuestionClear?.();
              }}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
