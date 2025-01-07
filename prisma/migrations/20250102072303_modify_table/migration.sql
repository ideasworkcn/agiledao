/*
  Warnings:

  - You are about to drop the column `number` on the `Epic` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Epic` table. All the data in the column will be lost.
  - You are about to drop the column `epicId` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `featureId` on the `UserStory` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Sprint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT,
    "name" TEXT,
    "goal" TEXT,
    "start_date" TEXT,
    "end_date" TEXT,
    "demo_date" TEXT,
    "estimate_velocity" INTEGER,
    "actual_velocity" INTEGER,
    "daily_standup" TEXT,
    "sprint_review" TEXT,
    "status" TEXT
);

-- CreateTable
CREATE TABLE "SprintUserStory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_story_id" TEXT,
    "sprint_id" TEXT
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "product_id" TEXT,
    "user_story_id" TEXT,
    "sprint_id" TEXT,
    CONSTRAINT "Task_user_story_id_fkey" FOREIGN KEY ("user_story_id") REFERENCES "UserStory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Epic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT,
    "name" TEXT,
    "px" INTEGER
);
INSERT INTO "new_Epic" ("id", "name", "px") SELECT "id", "name", "px" FROM "Epic";
DROP TABLE "Epic";
ALTER TABLE "new_Epic" RENAME TO "Epic";
CREATE TABLE "new_Feature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "px" INTEGER,
    "epic_id" TEXT,
    CONSTRAINT "Feature_epic_id_fkey" FOREIGN KEY ("epic_id") REFERENCES "Epic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Feature" ("id", "name") SELECT "id", "name" FROM "Feature";
DROP TABLE "Feature";
ALTER TABLE "new_Feature" RENAME TO "Feature";
CREATE TABLE "new_UserStory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT,
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
INSERT INTO "new_UserStory" ("id", "name") SELECT "id", "name" FROM "UserStory";
DROP TABLE "UserStory";
ALTER TABLE "new_UserStory" RENAME TO "UserStory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
