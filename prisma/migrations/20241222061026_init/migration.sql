-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "manager" TEXT,
    "start_date" TEXT,
    "due_date" TEXT,
    "status" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "name" TEXT,
    "position" TEXT,
    "role" TEXT,
    "created_at" TEXT,
    "status" TEXT
);
