-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "disabledAt" DATETIME,
    "canCreateBooks" BOOLEAN NOT NULL DEFAULT false,
    "canUpdateBooks" BOOLEAN NOT NULL DEFAULT false,
    "canDisableBooks" BOOLEAN NOT NULL DEFAULT false,
    "canUpdateUsers" BOOLEAN NOT NULL DEFAULT false,
    "canDisableUsers" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "genero" TEXT,
    "casaEditorial" TEXT,
    "fechaPublicacion" DATETIME,
    "disponibilidad" BOOLEAN NOT NULL DEFAULT true,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "disabledAt" DATETIME
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fechaReserva" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEntrega" DATETIME,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
