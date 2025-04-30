/*
  Warnings:

  - You are about to drop the column `correos` on the `Propietario` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `Propietario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Propietario" DROP COLUMN "correos",
DROP COLUMN "direccion";
