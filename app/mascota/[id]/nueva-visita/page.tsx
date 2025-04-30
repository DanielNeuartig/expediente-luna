// app/mascota/[id]/nueva-visita/page.tsx
'use server';

import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function NuevaVisitaPage({ params }: Props) {
  const mascotaId = Number(params.id);

  const mascota = await prisma.mascota.findUnique({
    where: { id: mascotaId },
    include: {
      propietario: true,
    },
  });

  if (!mascota) return notFound();

  async function registrarVisita(formData: FormData) {
    'use server';

    const tipo = formData.get('tipo') as string;
    const peso = parseFloat(formData.get('peso') as string);
    const temperatura = parseFloat(formData.get('temperatura') as string);
    const historiaClinica = formData.get('historiaClinica') as string;
    const notasAdicionales = formData.get('notasAdicionales') as string;

    await prisma.visita.create({
      data: {
        mascotaId: mascotaId,
        tipo: tipo as any, // podría usar enum TipoVisita
        peso: isNaN(peso) ? null : peso,
        temperatura: isNaN(temperatura) ? null : temperatura,
        historiaClinica,
        notasAdicionales,
      },
    });

    redirect(`/mascota/${mascotaId}`);
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Registrar nueva visita para {mascota.nombre}
      </h1>

      <form action={registrarVisita} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Tipo de visita</label>
          <select name="tipo" className="w-full border rounded px-3 py-2">
            <option value="CONSULTA_GENERAL">Consulta general</option>
            <option value="CONTROL_SUBSECUENTE">Control subsecuente</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Peso (kg)</label>
          <input type="number" step="0.1" name="peso" className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block font-medium mb-1">Temperatura (°C)</label>
          <input type="number" step="0.1" name="temperatura" className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block font-medium mb-1">Historia clínica</label>
          <textarea name="historiaClinica" className="w-full border rounded px-3 py-2" rows={3}></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Notas adicionales</label>
          <textarea name="notasAdicionales" className="w-full border rounded px-3 py-2" rows={2}></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
        >
          Guardar visita
        </button>
      </form>
    </div>
  );
}
