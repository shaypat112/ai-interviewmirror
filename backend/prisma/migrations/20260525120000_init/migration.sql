CREATE TABLE "Session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clerkUserId" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "transcript" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "improvements" TEXT NOT NULL,
  "exampleAnswer" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "difficulty" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "UserPreferences" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clerkUserId" TEXT NOT NULL,
  "preferredDifficulty" TEXT NOT NULL DEFAULT 'Medium',
  "preferredCategories" TEXT NOT NULL DEFAULT '[]',
  "showHints" BOOLEAN NOT NULL DEFAULT 1,
  "darkMode" BOOLEAN NOT NULL DEFAULT 1,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "UserPreferences_clerkUserId_key"
ON "UserPreferences"("clerkUserId");
