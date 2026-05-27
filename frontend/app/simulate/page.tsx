"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useSimulation } from "@/hooks/useSimulation";
import { SimulationQuestion } from "../components/interview/simulation/SimulationQuestion";
import { SimulationReport } from "../components/interview/simulation/SimulationReport";
import { SimulationSetup } from "../components/interview/simulation/SimulationSetup";

export default function SimulatePage() {
  const {
    phase,
    difficulty,
    setDifficulty,
    currentQuestion,
    currentIndex,
    results,
    overallScore,
    isSubmitting,
    error,
    startSimulation,
    submitAnswer,
    reset,
    totalQuestions,
  } = useSimulation();

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
        {/* Hero */}

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="destructive" className="rounded-2xl border">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Setup */}
        {phase === "setup" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <SimulationSetup
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              onStart={startSimulation}
            />
          </motion.div>
        )}

        {/* Question */}
        {(phase === "question" || phase === "analyzing") && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <SimulationQuestion
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={totalQuestions}
              isSubmitting={isSubmitting}
              onSubmit={submitAnswer}
            />
          </motion.div>
        )}

        {/* Report */}
        {phase === "report" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <SimulationReport
              results={results}
              overallScore={overallScore}
              difficulty={difficulty}
              onReset={reset}
            />
          </motion.div>
        )}
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {phase === "analyzing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <Card className="w-[320px] rounded-3xl border shadow-2xl">
              <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-muted">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Analyzing Responses</h2>

                  <p className="text-sm text-muted-foreground">
                    Evaluating technical accuracy, communication, and reasoning.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
