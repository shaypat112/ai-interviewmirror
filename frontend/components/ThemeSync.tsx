"use client";

import { useEffect } from "react";
import { DARK_MODE_STORAGE_KEY } from "@/lib/config";

export function ThemeSync() {
  useEffect(() => {
    const storedValue = window.localStorage.getItem(DARK_MODE_STORAGE_KEY);
    const darkModeEnabled = storedValue === null ? true : storedValue === "true";

    document.documentElement.dataset.theme = darkModeEnabled ? "dark" : "light";
  }, []);

  return null;
}
