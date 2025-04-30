'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NuevaMascotaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propietarioId = searchParams.get('propietarioId');

  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [raza, setRaza] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/mascotas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        especie,
        raza,
        propietarioId: Number(propietarioId),
      }),
    });

    if (res.ok) {
      router.push(`/propietario/${propietarioId}`);
    } else {
      alert('Error al guardar mascota');
    }
  };

  if (!propietarioId) return <p className="p-6 text-red-600">Error: propietarioId no proporcionado.</p>;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">🐶 Nueva Mascota</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Especie</label>
          <select
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option>Perro</option>
            <option>Gato</option>
            <option>Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Raza</label>
          <input
            type="text"
            value={raza}
            onChange={(e) => setRaza(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700"
        >
          Guardar mascota
        </button>
      </form>
    </div>
  );
}
