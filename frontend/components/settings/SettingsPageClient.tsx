"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  categories,
  type Category,
  type Difficulty,
} from "@/app/data/questions";
import { API_BASE_URL, DARK_MODE_STORAGE_KEY } from "@/lib/config";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface PreferencesResponse {
  clerkUserId: string;
  preferredDifficulty: Difficulty;
  preferredCategories: Category[];
  showHints: boolean;
  darkMode: boolean;
}

interface SettingsPageClientProps {
  clerkUserId: string;
}

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

// ── Small reusable section wrapper ─────────────────────────────
function Section({
  title,
  description,
  children,
  danger = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      style={{
        background: danger ? "var(--red-dim)" : "var(--surface-1)",
        border: `1px solid ${danger ? "rgba(239,68,68,0.25)" : "var(--border)"}`,
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--text-1)",
          letterSpacing: "-0.02em",
          marginBottom: description ? "6px" : "20px",
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-2)",
            marginBottom: "20px",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

// ── Difficulty pill button ─────────────────────────────────────
function DifficultyPill({
  value,
  selected,
  onClick,
}: {
  value: Difficulty;
  selected: boolean;
  onClick: () => void;
}) {
  const colors: Record<Difficulty, { active: string; idle: string }> = {
    Easy: {
      active:
        "background:var(--green-dim);color:var(--green);border:1px solid rgba(34,197,94,0.3)",
      idle: "",
    },
    Medium: {
      active:
        "background:var(--yellow-dim);color:var(--yellow);border:1px solid rgba(245,158,11,0.3)",
      idle: "",
    },
    Hard: {
      active:
        "background:var(--red-dim);color:var(--red);border:1px solid rgba(239,68,68,0.3)",
      idle: "",
    },
  };

  // Parse inline style string into object for React
  function parseStyle(s: string): React.CSSProperties {
    return Object.fromEntries(
      s
        .split(";")
        .filter(Boolean)
        .map((p) => {
          const [k, v] = p.split(":");
          // Convert kebab-case to camelCase
          const key = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          return [key, v.trim()];
        }),
    );
  }

  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 16px",
        borderRadius: "99px",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        border: "1px solid var(--border)",
        background: selected ? undefined : "var(--surface-2)",
        color: selected ? undefined : "var(--text-2)",
        transition: "all 0.15s ease",
        ...(selected ? parseStyle(colors[value].active) : {}),
      }}
    >
      {value}
    </button>
  );
}

// ── Category chip ──────────────────────────────────────────────
function CategoryChip({
  value,
  selected,
  onClick,
}: {
  value: Category;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: "99px",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        border: selected
          ? "1px solid rgba(99,102,241,0.4)"
          : "1px solid var(--border)",
        background: selected ? "var(--accent-dim)" : "var(--surface-2)",
        color: selected ? "var(--accent)" : "var(--text-2)",
        transition: "all 0.15s ease",
      }}
    >
      {value}
    </button>
  );
}

// ── Toggle row ─────────────────────────────────────────────────
function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "14px 16px",
        borderRadius: "12px",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}
    >
      <div>
        <Label
          htmlFor={id}
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-1)",
            cursor: "pointer",
          }}
        >
          {label}
        </Label>
        <p
          style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}
        >
          {description}
        </p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export function SettingsPageClient({ clerkUserId }: SettingsPageClientProps) {
  const { signOut } = useClerk();
  const { user } = useUser();

  const [preferences, setPreferences] = useState<PreferencesResponse>({
    clerkUserId,
    preferredDifficulty: "Medium",
    preferredCategories: [],
    showHints: true,
    darkMode: true,
  });
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/preferences/${clerkUserId}`,
        );
        if (!res.ok) throw new Error();
        const data = (await res.json()) as PreferencesResponse;
        setPreferences(data);
        document.documentElement.dataset.theme = data.darkMode
          ? "dark"
          : "light";
        localStorage.setItem(DARK_MODE_STORAGE_KEY, String(data.darkMode));
      } catch {
        setStatus({ msg: "Could not load saved preferences.", ok: false });
      }
    }
    void load();
  }, [clerkUserId]);

  function updateCategories(cat: Category) {
    setPreferences((p) => ({
      ...p,
      preferredCategories: p.preferredCategories.includes(cat)
        ? p.preferredCategories.filter((c) => c !== cat)
        : [...p.preferredCategories, cat],
    }));
  }

  async function save() {
    try {
      setIsSaving(true);
      setStatus(null);
      const res = await fetch(
        `${API_BASE_URL}/api/preferences/${clerkUserId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
        },
      );
      if (!res.ok) throw new Error();
      document.documentElement.dataset.theme = preferences.darkMode
        ? "dark"
        : "light";
      localStorage.setItem(DARK_MODE_STORAGE_KEY, String(preferences.darkMode));
      setStatus({ msg: "Settings saved successfully.", ok: true });
    } catch {
      setStatus({ msg: "Save failed. Try again.", ok: false });
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteHistory() {
    try {
      setIsDeleting(true);
      setStatus(null);
      const res = await fetch(`${API_BASE_URL}/api/sessions/${clerkUserId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setStatus({ msg: "Session history deleted.", ok: true });
      setDeleteConfirm(false);
    } catch {
      setStatus({ msg: "Could not delete history.", ok: false });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px" }}>
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
        className="animate-fade-in"
      >
        {/* Page header */}
        <div style={{ marginBottom: "16px" }}>
          <p className="label" style={{ marginBottom: "8px" }}>
            Your account
          </p>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "var(--text-1)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Settings
          </h1>
        </div>

        {/* Status toast */}
        {status && (
          <div
            className="animate-fade-in-fast"
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 500,
              background: status.ok ? "var(--green-dim)" : "var(--red-dim)",
              color: status.ok ? "var(--green)" : "var(--red)",
              border: `1px solid ${status.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}
          >
            {status.ok ? "✓ " : "✗ "}
            {status.msg}
          </div>
        )}

        {/* Account */}
        <Section title="Account" description="Your MirAI account details.">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {/* Avatar + name row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "4px",
              }}
            >
              {user?.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt="avatar"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "99px",
                    border: "1px solid var(--border)",
                  }}
                />
              )}
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--text-1)",
                  }}
                >
                  {user?.fullName ?? "—"}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-3)" }}>
                  {user?.primaryEmailAddress?.emailAddress ?? "—"}
                </p>
              </div>
            </div>

            <Separator
              style={{ background: "var(--border)", margin: "4px 0" }}
            />

            <button
              onClick={() => void signOut({ redirectUrl: "/" })}
              className="btn btn-secondary"
              style={{ alignSelf: "flex-start", fontSize: "13px" }}
            >
              Sign out
            </button>
          </div>
        </Section>

        {/* Interview preferences */}
        <Section
          title="Interview Preferences"
          description="These settings apply to the Practice and Simulate pages."
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Difficulty */}
            <div>
              <p className="label" style={{ marginBottom: "10px" }}>
                Default difficulty
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {DIFFICULTIES.map((d) => (
                  <DifficultyPill
                    key={d}
                    value={d}
                    selected={preferences.preferredDifficulty === d}
                    onClick={() =>
                      setPreferences((p) => ({ ...p, preferredDifficulty: d }))
                    }
                  />
                ))}
              </div>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            {/* Categories */}
            <div>
              <p className="label" style={{ marginBottom: "10px" }}>
                Preferred categories
                <span
                  style={{
                    color: "var(--text-3)",
                    marginLeft: "6px",
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (leave empty for all)
                </span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat}
                    value={cat}
                    selected={preferences.preferredCategories.includes(cat)}
                    onClick={() => updateCategories(cat)}
                  />
                ))}
              </div>
            </div>

            <Separator style={{ background: "var(--border)" }} />

            {/* Show hints */}
            <ToggleRow
              id="hints"
              label="Show hints on question cards"
              description="Display tips and STAR format reminders while answering."
              checked={preferences.showHints}
              onChange={(v) => setPreferences((p) => ({ ...p, showHints: v }))}
            />
          </div>
        </Section>

        {/* Save button */}
        <button
          onClick={() => void save()}
          disabled={isSaving}
          className="btn btn-primary"
          style={{
            alignSelf: "flex-start",
            padding: "10px 24px",
            fontSize: "13px",
          }}
        >
          {isSaving ? "Saving..." : "Save settings"}
        </button>

        {/* Danger zone */}
        <Section
          title="Danger Zone"
          description="Permanently delete all your saved interview sessions. This cannot be undone."
          danger
        >
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="btn btn-danger"
              style={{ fontSize: "13px" }}
            >
              Delete all session history
            </button>
          ) : (
            // Two-step confirm so users don't delete by accident
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <p style={{ fontSize: "13px", color: "var(--text-2)" }}>
                Are you sure? This is permanent.
              </p>
              <button
                onClick={() => void deleteHistory()}
                disabled={isDeleting}
                className="btn btn-danger"
                style={{ fontSize: "13px" }}
              >
                {isDeleting ? "Deleting..." : "Yes, delete everything"}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="btn btn-ghost"
                style={{ fontSize: "13px" }}
              >
                Cancel
              </button>
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}
