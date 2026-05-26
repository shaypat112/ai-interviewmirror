"use client";

// components/Navbar.tsx
//
// Linear/Vercel-inspired navbar:
// - Frosted glass effect with subtle border
// - Logo mark on the left
// - Nav links in the center
// - Clerk auth on the right
// - Active route highlighted

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const navLinks = [
  { href: "/", label: "Practice" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
  { href: "/simulate", label: "Simulate" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
        // Frosted glass — the signature Linear look
        background: "rgba(8, 12, 20, 0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <nav
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 24px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {/* Logomark — simple geometric shape, distinctive */}
          <span
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "#fff",
              fontFamily: "var(--font-mono)",
              letterSpacing: "-0.02em",
            }}
          >
            AI
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-1)",
              letterSpacing: "-0.03em",
              fontFamily: "var(--font-sans)",
            }}
          >
            InterviewAI
          </span>
        </Link>

        {/* ── Nav Links ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {navLinks.map((link) => {
            // Exact match for home, prefix match for others
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "var(--text-1)" : "var(--text-2)",
                  background: isActive ? "var(--surface-2)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-1)";
                    e.currentTarget.style.background = "var(--surface-1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-2)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── Auth ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {!isLoaded ? (
            // Skeleton while Clerk loads
            <div
              className="skeleton"
              style={{ width: "64px", height: "28px", borderRadius: "99px" }}
            />
          ) : isSignedIn ? (
            // Clerk's built-in user button — handles avatar, menu, sign out
            <UserButton
              afterSignOutUrl="/landingpage"
              appearance={{
                elements: {
                  avatarBox: {
                    width: "28px",
                    height: "28px",
                  },
                },
              }}
            />
          ) : (
            <>
              <SignInButton mode="modal">
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: "13px", padding: "4px 12px" }}
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "13px", padding: "5px 14px" }}
                >
                  Sign up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
