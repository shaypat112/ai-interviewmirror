import { categories, Category, Question, questions } from "@/app/data/questions";
import { useState } from "react";

export function useQuestionPicker() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<
    Question["difficulty"] | "All"
  >("All");
  const [noMatchMessage, setNoMatchMessage] = useState<string | null>(null);

  function pickRandomQuestion(
    category: Category,
    onSelect?: (question: Question) => void,
  ) {
    const pool = questions.filter((question) => {
      const categoryMatch = question.category === category;
      const difficultyMatch =
        difficultyFilter === "All" || question.difficulty === difficultyFilter;

      return categoryMatch && difficultyMatch;
    });

    if (pool.length === 0) {
      setSelectedCategory(category);
      setCurrentQuestion(null);
      setNoMatchMessage(
        `No ${difficultyFilter} questions are available for ${category} yet.`,
      );
      return;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const picked = pool[randomIndex];

    setSelectedCategory(category);
    setCurrentQuestion(picked);
    setNoMatchMessage(null);
    onSelect?.(picked);
  }

  function reset() {
    setSelectedCategory(null);
    setCurrentQuestion(null);
    setNoMatchMessage(null);
  }

  return {
    categories,
    selectedCategory,
    currentQuestion,
    difficultyFilter,
    setDifficultyFilter,
    noMatchMessage,
    pickRandomQuestion,
    reset,
  };
}
