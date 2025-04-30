// lib/mascota.ts
import { prisma } from './prisma';
// lib/mascota.ts

export async function obtenerMascotaConDetalles(id: number) {
    return await prisma.mascota.findUnique({
      where: { id },
      include: {
        propietario: {
          include: {
            telefonos: true,
          },
        },
        datosMedicos: true,
        visitas: {
          include: {
            medicamentos: true,
            indicaciones: true,
            archivos: true,
          },
          orderBy: {
            fecha: 'desc',
          },
        },
      },
    });
  }
  