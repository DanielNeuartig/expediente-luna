import { prisma } from '../../../lib/prisma';
import { notFound } from 'next/navigation';
import { Propietario, Mascota, Telefono } from '@prisma/client';
import Link from 'next/link';

type PropietarioCompleto = Propietario & {
  mascotas: Mascota[];
  telefonos: Telefono[];
};

interface Props {
  params: { id: string };
}

export default async function PropietarioPage({ params }: Props) {
  const propietario = await prisma.propietario.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      mascotas: true,
      telefonos: true,
    },
  }) as PropietarioCompleto;

  if (!propietario) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">👤 {propietario.nombre}</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-1">Teléfonos</h2>
        {propietario.telefonos.length === 0 ? (
          <p className="text-gray-500">Sin teléfonos registrados.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-800">
            {propietario.telefonos.map((tel) => (
              <li key={tel.id}>
                {tel.numero} {tel.esPrincipal && <strong className="text-green-600">(principal)</strong>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mt-6 mb-2">
          <h2 className="text-xl font-semibold text-gray-700">Mascotas</h2>
          <Link
            href={`/nueva/mascota?propietarioId=${propietario.id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            🐶 Añadir mascota 🐶
          </Link>
        </div>

        {propietario.mascotas.length === 0 ? (
          <p className="text-gray-500">Este propietario no tiene mascotas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {propietario.mascotas.map((m) => (
              <li key={m.id} className="bg-white shadow p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <Link
                    href={`/mascota/${m.id}`}
                    className="text-lg font-medium text-blue-600 hover:underline"
                  >
                    🐶 {m.nombre}
                  </Link>
                  {/* Aquí podrías agregar botones secundarios como editar o eliminar */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
