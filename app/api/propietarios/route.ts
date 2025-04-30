import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { nombre, telefonos } = body;

  try {
    const propietario = await prisma.propietario.create({
      data: {
        nombre,
        telefonos: {
          create: telefonos.map((t: { numero: string }) => ({ numero: t.numero })),
        },
      },
      include: { telefonos: true },
    });

    return NextResponse.json(propietario, { status: 201 });
  } catch (error) {
    console.error("Error al crear propietario:", error);
    return NextResponse.json({ error: "Error al crear propietario" }, { status: 500 });
  }
}
