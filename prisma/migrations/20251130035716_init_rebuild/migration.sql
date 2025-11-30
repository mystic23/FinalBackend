/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "disabledAt" DATETIME,
    "canCreateBooks" BOOLEAN NOT NULL DEFAULT false,
    "canUpdateBooks" BOOLEAN NOT NULL DEFAULT false,
    "canDisableBooks" BOOLEAN NOT NULL DEFAULT false,
    "canUpdateUsers" BOOLEAN NOT NULL DEFAULT false,
    "canDisableUsers" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("canCreateBooks", "canDisableBooks", "canDisableUsers", "canUpdateBooks", "canUpdateUsers", "disabledAt", "email", "id", "isDisabled", "nombre") SELECT "canCreateBooks", "canDisableBooks", "canDisableUsers", "canUpdateBooks", "canUpdateUsers", "disabledAt", "email", "id", "isDisabled", "nombre" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
