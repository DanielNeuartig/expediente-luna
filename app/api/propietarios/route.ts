import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { nombre, telefonos } = body;

  if (!nombre || !Array.isArray(telefonos)) {
    return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  }

  try {
    // Verificar nombre duplicado (case-insensitive)
    const nombreExistente = await prisma.propietario.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: "insensitive"
        }
      }
    });
    if (nombreExistente) {
      return NextResponse.json({ error: "Ya existe un propietario con ese nombre." }, { status: 400 });
    }

    // Verificar teléfono principal duplicado
    const principal = telefonos.find(t => t.esPrincipal);
    if (principal) {
      const telefonoExistente = await prisma.telefono.findFirst({
        where: {
          numero: principal.numero
        }
      });
      if (telefonoExistente) {
        return NextResponse.json({ error: "Ya existe un propietario con ese número principal." }, { status: 400 });
      }
    }

    // Crear propietario con sus teléfonos
    const propietario = await prisma.propietario.create({
      data: {
        nombre,
        telefonos: {
          create: telefonos
        }
      },
      include: { telefonos: true }
    });

    return NextResponse.json(propietario, { status: 201 });
  } catch (error) {
    console.error("Error al crear propietario:", error);
    return NextResponse.json({ error: "Error al crear propietario" }, { status: 500 });
  }
}
