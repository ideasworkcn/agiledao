/*
  Warnings:

  - You are about to drop the column `assigner` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `assigner` on the `TaskHour` table. All the data in the column will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "product_id" TEXT,
    "user_story_id" TEXT,
    "sprint_id" TEXT,
    "member_id" TEXT,
    "assigner_id" TEXT,
    "px" INTEGER,
    "estimated_hours" INTEGER,
    "hours" INTEGER,
    "start_time" DATETIME,
    "end_time" DATETIME,
    "create_time" DATETIME,
    "status" TEXT,
    CONSTRAINT "Task_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_assigner_id_fkey" FOREIGN KEY ("assigner_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_user_story_id_fkey" FOREIGN KEY ("user_story_id") REFERENCES "UserStory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("create_time", "description", "end_time", "estimated_hours", "hours", "id", "member_id", "name", "product_id", "px", "sprint_id", "start_time", "status", "user_story_id") SELECT "create_time", "description", "end_time", "estimated_hours", "hours", "id", "member_id", "name", "product_id", "px", "sprint_id", "start_time", "status", "user_story_id" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE INDEX "Task_product_id_idx" ON "Task"("product_id");
CREATE INDEX "Task_user_story_id_idx" ON "Task"("user_story_id");
CREATE INDEX "Task_sprint_id_idx" ON "Task"("sprint_id");
CREATE INDEX "Task_member_id_idx" ON "Task"("member_id");
CREATE INDEX "Task_assigner_id_idx" ON "Task"("assigner_id");
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE TABLE "new_TaskHour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "note" TEXT,
    "product_id" TEXT,
    "sprint_id" TEXT,
    "task_id" TEXT NOT NULL,
    "member_id" TEXT,
    "create_time" DATETIME,
    "hours" INTEGER,
    CONSTRAINT "TaskHour_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TaskHour" ("create_time", "hours", "id", "member_id", "note", "product_id", "sprint_id", "task_id") SELECT "create_time", "hours", "id", "member_id", "note", "product_id", "sprint_id", "task_id" FROM "TaskHour";
DROP TABLE "TaskHour";
ALTER TABLE "new_TaskHour" RENAME TO "TaskHour";
CREATE INDEX "TaskHour_product_id_idx" ON "TaskHour"("product_id");
CREATE INDEX "TaskHour_sprint_id_idx" ON "TaskHour"("sprint_id");
CREATE INDEX "TaskHour_task_id_idx" ON "TaskHour"("task_id");
CREATE INDEX "TaskHour_member_id_idx" ON "TaskHour"("member_id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "position" TEXT,
    "role" TEXT,
    "created_at" TEXT,
    "status" TEXT
);
INSERT INTO "new_User" ("created_at", "email", "id", "name", "position", "role", "status") SELECT "created_at", "email", "id", "name", "position", "role", "status" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;