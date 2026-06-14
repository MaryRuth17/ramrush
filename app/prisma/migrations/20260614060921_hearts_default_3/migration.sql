-- CreateTable
CREATE TABLE "MemorySession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "algorithm" TEXT NOT NULL,
    "stageType" TEXT,
    "mode" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "hearts" INTEGER NOT NULL DEFAULT 3,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "unprocessed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CpuSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "algorithm" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "avgWaitingTime" REAL,
    "avgTurnaround" REAL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "hearts" INTEGER NOT NULL DEFAULT 4,
    "inputProcesses" TEXT,
    "quantum" INTEGER NOT NULL DEFAULT 2,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "VmSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "algorithm" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "totalRefs" INTEGER NOT NULL,
    "pageFaults" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "hitRatio" REAL NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "hearts" INTEGER NOT NULL DEFAULT 4,
    "inputRefString" TEXT,
    "frameCount" INTEGER NOT NULL DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DiskSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "algorithm" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "headStart" INTEGER NOT NULL DEFAULT 53,
    "totalMovement" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "hearts" INTEGER NOT NULL DEFAULT 4,
    "inputRequests" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
