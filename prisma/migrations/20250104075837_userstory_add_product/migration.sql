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
    "product_id" TEXT,
    CONSTRAINT "UserStory_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "Feature" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "UserStory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_UserStory" ("estimate", "feature_id", "fzr", "howtodemo", "id", "importance", "name", "number", "product_id", "px", "status") SELECT "estimate", "feature_id", "fzr", "howtodemo", "id", "importance", "name", "number", "product_id", "px", "status" FROM "UserStory";
DROP TABLE "UserStory";
ALTER TABLE "new_UserStory" RENAME TO "UserStory";
CREATE UNIQUE INDEX "UserStory_number_key" ON "UserStory"("number");
CREATE INDEX "UserStory_feature_id_idx" ON "UserStory"("feature_id");
CREATE INDEX "UserStory_px_idx" ON "UserStory"("px");
CREATE INDEX "UserStory_status_idx" ON "UserStory"("status");
CREATE INDEX "UserStory_fzr_idx" ON "UserStory"("fzr");
CREATE INDEX "UserStory_feature_id_px_idx" ON "UserStory"("feature_id", "px");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
