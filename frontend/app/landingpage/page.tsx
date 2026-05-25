"use client";
import React, { JSX, useState } from "react";
import Link from "next/link";
// import emailJs from "emailjs-com";
export default function Page(): JSX.Element {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // placeholder: wire this to your mailing API
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3500);
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.title}>
            Build confidence with AI-powered interview practice
          </h1>
          <p style={styles.subtitle}>
            Practice common questions, get smart feedback, and track your
            progress — all in one place.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              aria-label="Email address"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.primaryButton}>
              Get early access
            </button>
          </form>

          {submitted && <p style={styles.toast}>Thanks — we'll be in touch!</p>}

          <div style={styles.ctaRow}>
            <Link href="/demo" style={styles.link}>
              Try a demo
            </Link>
            <Link href="/pricing" style={styles.linkSecondary}>
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.icon}>💬</div>
          <h3 style={styles.featureTitle}>Realistic practice</h3>
          <p style={styles.featureText}>
            Simulate interview conversations with realistic prompts and
            follow-ups.
          </p>
        </div>

        <div style={styles.feature}>
          <div style={styles.icon}>📈</div>
          <h3 style={styles.featureTitle}>Actionable feedback</h3>
          <p style={styles.featureText}>
            Receive concise feedback on structure, clarity, and technical depth.
          </p>
        </div>

        <div style={styles.feature}>
          <div style={styles.icon}>🗂️</div>
          <h3 style={styles.featureTitle}>Track progress</h3>
          <p style={styles.featureText}>
            Save sessions, monitor improvements, and focus on weak areas.
          </p>
        </div>
      </section>

      <footer style={styles.footer}>
        <div>© {new Date().getFullYear()} Interview Mirror</div>
        <div style={styles.footerLinks}>
          <Link href="/terms" style={styles.smallLink}>
            Terms
          </Link>
          <Link href="/privacy" style={styles.smallLink}>
            Privacy
          </Link>
        </div>
      </footer>
    </main>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    color: "#0f172a",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "linear-gradient(180deg,#f8fafc 0%, #ffffff 100%)",
  },
  hero: {
    padding: "72px 24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heroInner: {
    maxWidth: 900,
    textAlign: "center" as const,
  },
  title: {
    fontSize: 36,
    lineHeight: 1.05,
    margin: 0,
    fontWeight: 700,
    color: "#0b1220",
  },
  subtitle: {
    marginTop: 12,
    marginBottom: 24,
    color: "#475569",
    fontSize: 16,
  },
  form: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap" as const,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    minWidth: 260,
    fontSize: 14,
  },
  primaryButton: {
    padding: "12px 18px",
    borderRadius: 8,
    background: "#0ea5a4",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  toast: {
    marginTop: 12,
    color: "#059669",
  },
  ctaRow: {
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
    gap: 16,
  },
  link: {
    color: "#0ea5a4",
    textDecoration: "none",
    fontWeight: 600,
  },
  linkSecondary: {
    color: "#64748b",
    textDecoration: "none",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 20,
    padding: "48px 24px",
    maxWidth: 1000,
    margin: "0 auto",
    width: "100%",
  },
  feature: {
    background: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
    textAlign: "left" as const,
  },
  icon: {
    fontSize: 28,
    marginBottom: 12,
  },
  featureTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  featureText: {
    marginTop: 8,
    color: "#475569",
    fontSize: 14,
  },
  footer: {
    marginTop: "auto",
    padding: "24px",
    borderTop: "1px solid #eef2f7",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 1000,
    margin: "32px auto 24px",
    width: "100%",
    paddingLeft: 24,
    paddingRight: 24,
    color: "#64748b",
    fontSize: 14,
  },
  footerLinks: {
    display: "flex",
    gap: 16,
  },
  smallLink: {
    color: "#64748b",
    textDecoration: "none",
  },
};
