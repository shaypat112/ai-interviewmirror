"use client";

import { useState } from "react";
import { InterviewRecorder } from "./components/interview/InterviewRecorder";
import { QuestionPicker } from "./components/interview/QuestionPicker";
import type { Question } from "./data/questions";

export default function Home() {
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_30%),linear-gradient(180deg,_#0a0f1f_0%,_#050816_100%)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            AI Interview Mirror
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Practice coding and behavioral interviews with live transcripts,
            AI feedback, and saved progress once you sign in.
          </p>
        </section>

        <QuestionPicker
          onQuestionSelect={setActiveQuestion}
          onQuestionClear={() => setActiveQuestion(null)}
        />

        <InterviewRecorder
          activeQuestion={activeQuestion?.question ?? null}
          activeQuestionDetails={activeQuestion}
        />
      </div>
    </main>
  );
}
