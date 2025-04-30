import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json({ propietarios: [], mascotas: [] });

  // Paso 1: Obtener propietarios que coincidan por nombre o teléfono
  const propietariosDirectos = await prisma.propietario.findMany({
    where: {
      OR: [
        {
          nombre: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          telefonos: {
            some: {
              numero: {
                contains: q,
              },
            },
          },
        },
      ],
    },
    include: {
      telefonos: true,
    },
  });

  // Paso 2: Obtener mascotas que coincidan por nombre
  const mascotasDirectas = await prisma.mascota.findMany({
    where: {
      nombre: {
        contains: q,
        mode: 'insensitive',
      },
    },
    include: {
      propietario: {
        include: {
          telefonos: true,
        },
      },
    },
  });

  // Paso 3: Obtener mascotas con propietario cuyo nombre o teléfono coincidan
  const mascotasPorPropietario = await prisma.mascota.findMany({
    where: {
      propietario: {
        OR: [
          {
            nombre: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            telefonos: {
              some: {
                numero: {
                  contains: q,
                },
              },
            },
          },
        ],
      },
    },
    include: {
      propietario: {
        include: {
          telefonos: true,
        },
      },
    },
  });

  // Paso 4: Obtener propietarios de mascotas que coincidan por nombre
  const propietariosPorMascota = await prisma.propietario.findMany({
    where: {
      mascotas: {
        some: {
          nombre: {
            contains: q,
            mode: 'insensitive',
          },
        },
      },
    },
    include: {
      telefonos: true,
    },
  });

  // Unificar y eliminar duplicados
  const propietariosSet = new Map();
  [...propietariosDirectos, ...propietariosPorMascota].forEach((p) => {
    propietariosSet.set(p.id, p);
  });

  const mascotasSet = new Map();
  [...mascotasDirectas, ...mascotasPorPropietario].forEach((m) => {
    mascotasSet.set(m.id, m);
  });

  return NextResponse.json({
    propietarios: Array.from(propietariosSet.values()),
    mascotas: Array.from(mascotasSet.values()),
  });
}
