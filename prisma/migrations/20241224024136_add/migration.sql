-- CreateTable
CREATE TABLE "Epic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT,
    "productId" TEXT,
    "name" TEXT,
    "px" INTEGER
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "epicId" TEXT,
    CONSTRAINT "Feature_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserStory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "featureId" TEXT,
    CONSTRAINT "UserStory_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
