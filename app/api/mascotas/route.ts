import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { nombre, especie, raza, propietarioId } = body;

  try {
    const nueva = await prisma.mascota.create({
      data: {
        nombre,
        especie,
        raza,
        propietarioId,
      },
    });

    return NextResponse.json(nueva);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear mascota' }, { status: 500 });
  }
}
