// app/mascota/[id]/page.tsx
import { obtenerMascotaConDetalles } from '@/lib/mascota';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react'; // Requiere: lucide-react instalado

export default async function DetalleMascota({ params }: { params: { id: string } }) {
  const mascota = await obtenerMascotaConDetalles(Number(params.id));

  if (!mascota) return notFound();

  const {
    nombre,
    especie,
    raza,
    sexo,
    color,
    fechaNacimiento,
    senasPartic,
    propietario,
    datosMedicos,
    visitas,
  } = mascota;

  const telefonoPrincipal =
    propietario.telefonos.find((t) => t.esPrincipal)?.numero || 'Sin teléfono';

  const calcularEdad = (fecha: Date | null | undefined) => {
    if (!fecha) return 'Desconocida';
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();
    return `${edad} años`;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{nombre}</h1>

      <section className="space-y-1">
        <h2 className="text-xl font-semibold">Información general</h2>
        <p><strong>Especie:</strong> {especie}</p>
        <p><strong>Raza:</strong> {raza || 'No especificada'}</p>
        <p><strong>Sexo:</strong> {sexo || 'No especificado'}</p>
        <p><strong>Color:</strong> {color || 'No especificado'}</p>
        <p><strong>Fecha de nacimiento:</strong> {fechaNacimiento?.toLocaleDateString() || 'No especificada'}</p>
        <p><strong>Edad:</strong> {calcularEdad(fechaNacimiento)}</p>
        <p><strong>Señas particulares:</strong> {senasPartic || 'No especificadas'}</p>
      </section>

      {datosMedicos && (
        <section className="space-y-1">
          <h2 className="text-xl font-semibold">Datos médicos</h2>
          <p><strong>Esterilizado:</strong> {datosMedicos.esterilizado ? 'Sí' : 'No'}</p>
          <p><strong>Peso actual:</strong> {datosMedicos.pesoActual ?? 'No registrado'} kg</p>
          <p><strong>Alergias:</strong> {datosMedicos.alergias || 'Ninguna'}</p>
        </section>
      )}

      <section className="space-y-1">
        <h2 className="text-xl font-semibold">Propietario</h2>
        <p><strong>Nombre:</strong> {propietario.nombre}</p>
        <p><strong>Teléfono principal:</strong> {telefonoPrincipal}</p>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Historial de visitas</h2>
          <Link
            href={`/mascota/${mascota.id}/nueva-visita`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow transition"
          >
            <PlusCircle className="w-5 h-5" />
            Añadir visita
          </Link>
        </div>

        {visitas.length === 0 ? (
          <p className="text-gray-500">No hay visitas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {visitas.map((visita) => (
              <li key={visita.id} className="border rounded p-3 shadow-sm">
                <p><strong>Tipo:</strong> {visita.tipo}</p>
                <p><strong>Fecha:</strong> {new Date(visita.fecha).toLocaleDateString()}</p>
                <p><strong>Peso:</strong> {visita.peso ?? 'N/A'} kg</p>
                <p><strong>Temperatura:</strong> {visita.temperatura ?? 'N/A'} °C</p>
                {visita.historiaClinica && <p><strong>Historia clínica:</strong> {visita.historiaClinica}</p>}
                {visita.procedimiento && <p><strong>Procedimiento:</strong> {visita.procedimiento}</p>}
                {visita.notasAdicionales && <p><strong>Notas:</strong> {visita.notasAdicionales}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
