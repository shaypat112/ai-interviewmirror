import { InterviewRecorder } from "./components/interview-recorder";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_30%),linear-gradient(180deg,_#0a0f1f_0%,_#050816_100%)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            Frontend
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            AI Interview Mirror
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Record a practice interview, preview the video, and send it to the
            Nest backend for processing.
          </p>
        </section>

        <InterviewRecorder />
      </div>
    </main>
  );
}
