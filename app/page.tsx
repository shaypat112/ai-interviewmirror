import { InterviewRecorder } from "./components/interview-recorder";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">AI Interview Mirror</h1>

      <div className="mt-8">
        <InterviewRecorder />
      </div>
    </main>
  );
}
