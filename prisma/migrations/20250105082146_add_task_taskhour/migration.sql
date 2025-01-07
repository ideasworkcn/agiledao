-- AlterTable
ALTER TABLE "Task" ADD COLUMN "assigner" TEXT;
ALTER TABLE "Task" ADD COLUMN "create_time" DATETIME;
ALTER TABLE "Task" ADD COLUMN "end_time" DATETIME;
ALTER TABLE "Task" ADD COLUMN "estimated_hours" INTEGER;
ALTER TABLE "Task" ADD COLUMN "hours" INTEGER;
ALTER TABLE "Task" ADD COLUMN "member_id" TEXT;
ALTER TABLE "Task" ADD COLUMN "px" INTEGER;
ALTER TABLE "Task" ADD COLUMN "start_time" DATETIME;
ALTER TABLE "Task" ADD COLUMN "status" TEXT;

-- CreateTable
CREATE TABLE "TaskHour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "note" TEXT,
    "product_id" TEXT,
    "sprint_id" TEXT,
    "task_id" TEXT NOT NULL,
    "member_id" TEXT,
    "assigner" TEXT,
    "create_time" DATETIME,
    "hours" INTEGER,
    CONSTRAINT "TaskHour_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TaskHour_product_id_idx" ON "TaskHour"("product_id");

-- CreateIndex
CREATE INDEX "TaskHour_sprint_id_idx" ON "TaskHour"("sprint_id");

-- CreateIndex
CREATE INDEX "TaskHour_task_id_idx" ON "TaskHour"("task_id");

-- CreateIndex
CREATE INDEX "TaskHour_member_id_idx" ON "TaskHour"("member_id");

-- CreateIndex
CREATE INDEX "Task_product_id_idx" ON "Task"("product_id");

-- CreateIndex
CREATE INDEX "Task_user_story_id_idx" ON "Task"("user_story_id");

-- CreateIndex
CREATE INDEX "Task_sprint_id_idx" ON "Task"("sprint_id");

-- CreateIndex
CREATE INDEX "Task_member_id_idx" ON "Task"("member_id");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");
