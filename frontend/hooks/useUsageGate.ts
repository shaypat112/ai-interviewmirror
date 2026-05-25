"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const FREE_LIMIT = 3;
const STORAGE_KEY = "interview_analyze_count";

export function useUsageGate() {
  const { isSignedIn } = useUser();
  const [count, setCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setCount(Number.parseInt(stored ?? "0", 10) || 0);
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      window.localStorage.removeItem(STORAGE_KEY);
      setCount(0);
    }
  }, [isSignedIn]);

  function checkAndIncrement() {
    if (isSignedIn) {
      return true;
    }

    const newCount = count + 1;

    if (newCount > FREE_LIMIT) {
      setShowAuthModal(true);
      return false;
    }

    window.localStorage.setItem(STORAGE_KEY, String(newCount));
    setCount(newCount);
    return true;
  }

  function dismissModal() {
    setShowAuthModal(false);
  }

  return {
    count,
    freeLimit: FREE_LIMIT,
    showAuthModal,
    checkAndIncrement,
    dismissModal,
  };
}
