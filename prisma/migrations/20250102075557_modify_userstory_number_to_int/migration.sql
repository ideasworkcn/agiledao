/*
  Warnings:

  - You are about to alter the column `number` on the `UserStory` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserStory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER,
    "name" TEXT,
    "importance" INTEGER,
    "estimate" INTEGER,
    "howtodemo" TEXT,
    "px" INTEGER,
    "fzr" TEXT,
    "status" TEXT,
    "feature_id" TEXT,
    CONSTRAINT "UserStory_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "Feature" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_UserStory" ("estimate", "feature_id", "fzr", "howtodemo", "id", "importance", "name", "number", "px", "status") SELECT "estimate", "feature_id", "fzr", "howtodemo", "id", "importance", "name", "number", "px", "status" FROM "UserStory";
DROP TABLE "UserStory";
ALTER TABLE "new_UserStory" RENAME TO "UserStory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
