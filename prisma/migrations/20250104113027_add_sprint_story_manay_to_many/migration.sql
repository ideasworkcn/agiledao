/*
  Warnings:

  - Made the column `sprint_id` on table `SprintUserStory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_story_id` on table `SprintUserStory` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SprintUserStory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_story_id" TEXT NOT NULL,
    "sprint_id" TEXT NOT NULL,
    CONSTRAINT "SprintUserStory_user_story_id_fkey" FOREIGN KEY ("user_story_id") REFERENCES "UserStory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SprintUserStory_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "Sprint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SprintUserStory" ("id", "sprint_id", "user_story_id") SELECT "id", "sprint_id", "user_story_id" FROM "SprintUserStory";
DROP TABLE "SprintUserStory";
ALTER TABLE "new_SprintUserStory" RENAME TO "SprintUserStory";
CREATE INDEX "SprintUserStory_user_story_id_idx" ON "SprintUserStory"("user_story_id");
CREATE INDEX "SprintUserStory_sprint_id_idx" ON "SprintUserStory"("sprint_id");
CREATE UNIQUE INDEX "SprintUserStory_user_story_id_sprint_id_key" ON "SprintUserStory"("user_story_id", "sprint_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
