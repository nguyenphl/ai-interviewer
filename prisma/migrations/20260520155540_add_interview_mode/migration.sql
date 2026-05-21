-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,
    "topic" TEXT,
    "interviewMode" TEXT NOT NULL DEFAULT 'direct',
    "status" TEXT NOT NULL DEFAULT 'active',
    "totalScore" REAL,
    "durationSec" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
);
INSERT INTO "new_Session" ("completedAt", "createdAt", "durationSec", "id", "language", "level", "role", "sessionType", "status", "topic", "totalScore") SELECT "completedAt", "createdAt", "durationSec", "id", "language", "level", "role", "sessionType", "status", "topic", "totalScore" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
