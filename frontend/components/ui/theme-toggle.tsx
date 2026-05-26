"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="size-5 text-blue-400" />
      ) : (
        <Moon className="size-5 text-blue-900" />
      )}
    </Button>
  );
}
