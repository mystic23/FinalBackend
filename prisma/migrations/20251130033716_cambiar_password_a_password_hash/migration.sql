/*
  Warnings:

  - You are about to drop the column `bookId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `libroId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaReserva" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntrega" DATETIME,
    "usuarioId" INTEGER NOT NULL,
    "libroId" INTEGER NOT NULL,
    CONSTRAINT "Reservation_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("fechaEntrega", "fechaReserva", "id") SELECT "fechaEntrega", "fechaReserva", "id" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
