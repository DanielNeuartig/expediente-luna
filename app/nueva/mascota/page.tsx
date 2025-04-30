'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NuevaMascotaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propietarioId = searchParams.get('propietarioId');

  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [sexo, setSexo] = useState('');
  const [color, setColor] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [senasPartic, setSenasPartic] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/mascotas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        especie,
        raza,
        sexo,
        color,
        fechaNacimiento,
        senasPartic,
        propietarioId: Number(propietarioId),
      }),
    });

    if (res.ok) {
      router.push(`/propietario/${propietarioId}`);
    } else {
      alert('Error al guardar la mascota');
    }
  };

  if (!propietarioId) return <p>Error: propietarioId no proporcionado.</p>;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🐶 Nueva Mascota</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label>Especie</label>
          <input
            type="text"
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label>Raza</label>
          <input
            type="text"
            value={raza}
            onChange={(e) => setRaza(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label>Sexo</label>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="w-full border rounded px-4 py-2"
          >
            <option value="">Seleccione</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>
        <div>
          <label>Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label>Señas Particulares</label>
          <textarea
            value={senasPartic}
            onChange={(e) => setSenasPartic(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700"
        >
          Guardar Mascota
        </button>
      </form>
    </div>
  );
}
