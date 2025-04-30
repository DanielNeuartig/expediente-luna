import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
 // Ajusta la ruta si es diferente

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json({ propietarios: [], mascotas: [] });

  const propietarios = await prisma.propietario.findMany({
    where: {
      nombre: {
        contains: q,
        mode: 'insensitive',
      },
    },
  });

  const mascotas = await prisma.mascota.findMany({
    where: {
      nombre: {
        contains: q,
        mode: 'insensitive',
      },
    },
    include: {
      propietario: true, // útil para mostrar nombre del dueño
    },
  });

  return NextResponse.json({ propietarios, mascotas });
}
