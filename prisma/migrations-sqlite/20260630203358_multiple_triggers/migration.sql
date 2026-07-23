/*
  Warnings:

  - You are about to drop the column `trigger` on the `Event` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "EventTrigger" (
    "eventId" INTEGER NOT NULL,
    "triggerId" INTEGER NOT NULL,

    PRIMARY KEY ("eventId", "triggerId"),
    CONSTRAINT "EventTrigger_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventTrigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "Trigger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "moodScore" INTEGER,
    "notes" TEXT,
    "eventDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Event" ("category", "createdAt", "eventDate", "id", "moodScore", "notes", "value") SELECT "category", "createdAt", "eventDate", "id", "moodScore", "notes", "value" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
