'use client';

import { useState, useEffect } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<{ propietarios: any[], mascotas: any[] }>({ propietarios: [], mascotas: [] });

  useEffect(() => {
    if (query.length < 2) {
      setResultados({ propietarios: [], mascotas: [] });
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/buscar?q=${query}`);
      const data = await res.json();
      setResultados(data);
    }, 300); // pequeña espera para evitar spam de llamadas

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Buscar propietario o mascota..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-4 py-2 rounded w-full"
      />
      {(resultados.propietarios.length > 0 || resultados.mascotas.length > 0) && (
        <div className="absolute top-full left-0 bg-white shadow mt-1 rounded w-full z-10">
          <div className="p-2 border-b font-bold text-sm text-gray-500">Propietarios</div>
          {resultados.propietarios.map((p) => (
            <div key={`p-${p.id}`} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {p.nombre}
            </div>
          ))}
          <div className="p-2 border-b font-bold text-sm text-gray-500">Mascotas</div>
          {resultados.mascotas.map((m) => (
            <div key={`m-${m.id}`} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {m.nombre} ({m.propietario?.nombre ?? 'sin dueño'})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
