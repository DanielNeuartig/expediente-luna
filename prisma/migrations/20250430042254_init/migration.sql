-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('CEO', 'ADMIN', 'MEDICO');

-- CreateEnum
CREATE TYPE "TipoVisita" AS ENUM ('CONSULTA_GENERAL', 'CONTROL_SUBSECUENTE');

-- CreateTable
CREATE TABLE "UsuarioSistema" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsuarioSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propietario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correos" TEXT,
    "direccion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Propietario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telefono" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "propietarioId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Telefono_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raza" TEXT,
    "sexo" TEXT,
    "color" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "senasPartic" TEXT,
    "propietarioId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatoMedico" (
    "id" SERIAL NOT NULL,
    "mascotaId" INTEGER NOT NULL,
    "esterilizado" BOOLEAN NOT NULL,
    "pesoActual" DOUBLE PRECISION,
    "alergias" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatoMedico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visita" (
    "id" SERIAL NOT NULL,
    "mascotaId" INTEGER NOT NULL,
    "tipo" "TipoVisita" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edadMascota" INTEGER,
    "peso" DOUBLE PRECISION,
    "temperatura" DOUBLE PRECISION,
    "historiaClinica" TEXT,
    "procedimiento" TEXT,
    "notasAdicionales" TEXT,
    "creadoPorId" INTEGER,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicamentoRecetado" (
    "id" SERIAL NOT NULL,
    "visitaId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "enReceta" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicamentoRecetado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicacionMedica" (
    "id" SERIAL NOT NULL,
    "visitaId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "enReceta" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndicacionMedica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Archivo" (
    "id" SERIAL NOT NULL,
    "visitaId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Archivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSistema_email_key" ON "UsuarioSistema"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DatoMedico_mascotaId_key" ON "DatoMedico"("mascotaId");

-- AddForeignKey
ALTER TABLE "Telefono" ADD CONSTRAINT "Telefono_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Propietario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Propietario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatoMedico" ADD CONSTRAINT "DatoMedico_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visita" ADD CONSTRAINT "Visita_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visita" ADD CONSTRAINT "Visita_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "UsuarioSistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicamentoRecetado" ADD CONSTRAINT "MedicamentoRecetado_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "Visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicacionMedica" ADD CONSTRAINT "IndicacionMedica_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "Visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archivo" ADD CONSTRAINT "Archivo_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "Visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
