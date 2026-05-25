"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  categories,
  type Category,
  type Difficulty,
} from "@/app/data/questions";
import { API_BASE_URL, DARK_MODE_STORAGE_KEY } from "@/lib/config";

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
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/preferences/${clerkUserId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load preferences");
        }

        const data = (await response.json()) as PreferencesResponse;
        setPreferences(data);
        document.documentElement.dataset.theme = data.darkMode
          ? "dark"
          : "light";
        window.localStorage.setItem(
          DARK_MODE_STORAGE_KEY,
          String(data.darkMode),
        );
      } catch {
        setStatus("Could not load your saved preferences yet.");
      }
    }

    void loadPreferences();
  }, [clerkUserId]);

  function updateCategories(category: Category) {
    setPreferences((current) => {
      const exists = current.preferredCategories.includes(category);
      const preferredCategories = exists
        ? current.preferredCategories.filter((item) => item !== category)
        : [...current.preferredCategories, category];

      return {
        ...current,
        preferredCategories,
      };
    });
  }

  async function savePreferences() {
    try {
      setIsSaving(true);
      setStatus(null);

      const response = await fetch(
        `${API_BASE_URL}/api/preferences/${clerkUserId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      document.documentElement.dataset.theme = preferences.darkMode
        ? "dark"
        : "light";
      window.localStorage.setItem(
        DARK_MODE_STORAGE_KEY,
        String(preferences.darkMode),
      );
      setStatus("Preferences saved.");
    } catch {
      setStatus("Saving failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteHistory() {
    try {
      setIsDeleting(true);
      setStatus(null);

      const response = await fetch(
        `${API_BASE_URL}/api/sessions/${clerkUserId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete history");
      }

      setStatus("All session history deleted.");
    } catch {
      setStatus("Could not delete your history yet.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_30%),linear-gradient(180deg,_#0a0f1f_0%,_#050816_100%)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section className="rounded-3xl border border-white/10 bg-surface p-6">
          {status ? (
            <p className="mt-4 text-sm text-cyan-300">{status}</p>
          ) : null}
        </section>

        <section className="rounded-3xl border border-white/10 bg-surface p-6">
          <h2 className="text-lg font-semibold text-white">
            Interview preferences
          </h2>

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-200">
              Default difficulty
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {DIFFICULTIES.map((difficulty) => (
                <label
                  key={difficulty}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm ${
                    preferences.preferredDifficulty === difficulty
                      ? "bg-white text-slate-950"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    className="sr-only"
                    checked={preferences.preferredDifficulty === difficulty}
                    onChange={() =>
                      setPreferences((current) => ({
                        ...current,
                        preferredDifficulty: difficulty,
                      }))
                    }
                  />
                  {difficulty}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-slate-200">
              Preferred categories
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm ${
                    preferences.preferredCategories.includes(category)
                      ? "bg-cyan-400/20 text-cyan-100"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={preferences.preferredCategories.includes(category)}
                    onChange={() => updateCategories(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-surface p-6">
          <h2 className="text-lg font-semibold text-white">Appearance</h2>

          <label className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-sm font-medium text-white">Dark mode</p>
              <p className="text-sm text-slate-400">
                Toggle the app between the dark and light theme.
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.darkMode}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  darkMode: event.target.checked,
                }))
              }
            />
          </label>
        </section>

        <section className="rounded-3xl border border-white/10 bg-surface p-6">
          <h2 className="text-lg font-semibold text-white">Account</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p>Name: {user?.fullName ?? "No name available"}</p>
            <p>
              Email:{" "}
              {user?.primaryEmailAddress?.emailAddress ?? "No email available"}
            </p>
          </div>
          <button
            onClick={() => void signOut({ redirectUrl: "/" })}
            className="mt-5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
          >
            Sign out
          </button>
        </section>

        <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6">
          <h2 className="text-lg font-semibold text-white">Danger zone</h2>
          <p className="mt-2 text-sm text-rose-100/80">
            Delete all saved interview sessions from your history.
          </p>
          <button
            onClick={() => void deleteHistory()}
            disabled={isDeleting}
            className="mt-5 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete all my session history"}
          </button>
        </section>

        <button
          onClick={() => void savePreferences()}
          disabled={isSaving}
          className="self-start rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </main>
  );
}
