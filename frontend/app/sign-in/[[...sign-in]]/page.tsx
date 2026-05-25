import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_#0a0f1f_0%,_#050816_100%)] px-6 py-12">
      <SignIn />
    </main>
  );
}
