import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const {
    nombre,
    especie,
    raza,
    sexo,
    color,
    fechaNacimiento,
    senasPartic,
    propietarioId,
  } = body;

  try {
    const nuevaMascota = await prisma.mascota.create({
      data: {
        nombre,
        especie,
        raza,
        sexo,
        color,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        senasPartic,
        propietarioId,
      },
    });

    return NextResponse.json(nuevaMascota);
  } catch (error) {
    console.error('Error al crear mascota:', error);
    return NextResponse.json(
      { error: 'Error al crear la mascota' },
      { status: 500 }
    );
  }
}
