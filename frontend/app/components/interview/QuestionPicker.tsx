"use client";

import { useUser } from "@clerk/nextjs";
import { AlertTriangle, Lightbulb, RefreshCw, RotateCcw } from "lucide-react"; // Nice-to-have icons for action buttons
import { useEffect, useMemo, useState } from "react";
import type { Category, Difficulty, Question } from "@/app/data/questions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useQuestionPicker } from "@/hooks/useQuestionPicker";
import { API_BASE_URL } from "@/lib/config";

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
  Medium:
    "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
  Hard: "bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/20",
};

const categoryStyles: Record<Category, string> = {
  "Arrays & Hashing":
    "bg-cyan-500/15 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20",
  "Linked Lists":
    "bg-violet-500/15 text-violet-400 border-violet-500/30 hover:bg-violet-500/20",
  "Trees & Graphs":
    "bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/20",
  "Dynamic Programming":
    "bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/20",
  "Sorting & Searching":
    "bg-sky-500/15 text-sky-400 border-sky-500/30 hover:bg-sky-500/20",
  Behavioral:
    "bg-pink-500/15 text-pink-400 border-pink-500/30 hover:bg-pink-500/20",
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

    return categories.filter((category) =>
      allowedCategories.includes(category),
    );
  }, [allowedCategories, categories]);

  return (
    <div className="space-y-6">
      {/* Category Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            Pick a Category
          </CardTitle>
          <CardDescription className="text-slate-400">
            Select a topic and get a random interview question.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Difficulty Filter Section */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Difficulty
            </p>
            <div className="flex flex-wrap gap-3">
              {(["All", "Easy", "Medium", "Hard"] as const).map((option) => (
                <Button
                  key={option}
                  variant={
                    difficultyFilter === option ? "default" : "secondary"
                  }
                  onClick={() => setDifficultyFilter(option)}
                  className="rounded-full"
                  size="sm"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Topic Select Section */}
          <div className="flex flex-wrap gap-3">
            {visibleCategories.map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => pickRandomQuestion(category, onQuestionSelect)}
                className={`rounded-full ${categoryStyles[category]}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hints Banner using Shadcn Alert Component */}
      {showHints && (
        <Alert className="border-slate-800 bg-slate-900/40 text-slate-300">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <AlertTitle className="text-slate-200 font-medium">
            Interview Tip
          </AlertTitle>
          <AlertDescription className="text-slate-400">
            Take a moment to outline your answer and aim for a clear
            60-to-90-second response.
          </AlertDescription>
        </Alert>
      )}

      {/* No Match Warning State using Shadcn Alert Component */}
      {noMatchMessage && (
        <Alert
          variant="destructive"
          className="border-amber-500/20 bg-amber-500/10 text-amber-200"
        >
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertTitle>No Match Found</AlertTitle>
          <AlertDescription>{noMatchMessage}</AlertDescription>
        </Alert>
      )}

      {/* Active Question Display Card */}
      {currentQuestion && (
        <Card className="border-white/10 bg-slate-900/60 transition-all duration-300">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`rounded-full ${categoryStyles[currentQuestion.category]}`}
              >
                {currentQuestion.category}
              </Badge>
              <Badge
                variant="outline"
                className={`rounded-full ${difficultyStyles[currentQuestion.difficulty]}`}
              >
                {currentQuestion.difficulty}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-base leading-7 text-slate-100 font-medium">
              {currentQuestion.question}
            </p>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button
              onClick={() =>
                pickRandomQuestion(currentQuestion.category, onQuestionSelect)
              }
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              New Question
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                reset();
                onQuestionClear?.();
              }}
              className="text-slate-400 hover:text-white gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
