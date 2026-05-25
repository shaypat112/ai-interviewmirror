import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Interview Mirror",
  description:
    "Record interview practice sessions and send them to the backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-neutral-950 text-neutral-50">
        {children}
      </body>
    </html>
  );
}
