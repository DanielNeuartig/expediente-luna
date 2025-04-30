'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<{ propietarios: any[]; mascotas: any[] }>({
    propietarios: [],
    mascotas: [],
  });

  useEffect(() => {
    if (query.length < 2) {
      setResultados({ propietarios: [], mascotas: [] });
      return;
    }

    const delay = setTimeout(async () => {
      const res = await fetch(`/api/buscar?q=${query}`);
      const data = await res.json();
      setResultados(data);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-blue-700">🐾 EXPEDIENTE LUNA</h1>
        <p className="text-gray-600 mt-2">Busca rápidamente propietarios o mascotas</p>
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg"
        />
        <Link
          href="/nueva/propietario"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-center text-lg font-medium transition"
        >
          + Nuevo propietario
        </Link>
      </div>

      {(resultados.propietarios.length > 0 || resultados.mascotas.length > 0) && (
        <div className="space-y-6">
          {resultados.propietarios.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Propietarios encontrados</h2>
              <div className="space-y-2">
                {resultados.propietarios.map((p) => (
                  <Link
                    key={`p-${p.id}`}
                    href={`/propietario/${p.id}`}
                    className="block bg-white p-4 rounded-xl shadow hover:bg-blue-50 transition text-lg"
                  >
                    👤 {p.nombre}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {resultados.mascotas.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Mascotas encontradas</h2>
              <div className="space-y-2">
                {resultados.mascotas.map((m) => (
                  <Link
                    key={`m-${m.id}`}
                    href={`/mascota/${m.id}`}
                    className="block bg-white p-4 rounded-xl shadow hover:bg-blue-50 transition text-lg"
                  >
                    🐶 {m.nombre} <span className="text-sm text-gray-500">({m.propietario?.nombre ?? 'sin propietario'})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
