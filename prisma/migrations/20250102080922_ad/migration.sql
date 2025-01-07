/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `UserStory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Epic_product_id_idx" ON "Epic"("product_id");

-- CreateIndex
CREATE INDEX "Epic_px_idx" ON "Epic"("px");

-- CreateIndex
CREATE INDEX "Feature_epic_id_idx" ON "Feature"("epic_id");

-- CreateIndex
CREATE INDEX "Feature_px_idx" ON "Feature"("px");

-- CreateIndex
CREATE INDEX "Feature_epic_id_px_idx" ON "Feature"("epic_id", "px");

-- CreateIndex
CREATE UNIQUE INDEX "UserStory_number_key" ON "UserStory"("number");

-- CreateIndex
CREATE INDEX "UserStory_feature_id_idx" ON "UserStory"("feature_id");

-- CreateIndex
CREATE INDEX "UserStory_px_idx" ON "UserStory"("px");

-- CreateIndex
CREATE INDEX "UserStory_status_idx" ON "UserStory"("status");

-- CreateIndex
CREATE INDEX "UserStory_fzr_idx" ON "UserStory"("fzr");

-- CreateIndex
CREATE INDEX "UserStory_feature_id_px_idx" ON "UserStory"("feature_id", "px");
