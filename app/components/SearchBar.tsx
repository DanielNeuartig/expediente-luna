'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Telefono {
  numero: string;
  esPrincipal: boolean;
}

interface Propietario {
  id: number;
  nombre: string;
  telefonos?: Telefono[];
  tipo: 'propietario';
}

interface Mascota {
  id: number;
  nombre: string;
  propietario?: {
    nombre: string;
    telefonos?: Telefono[];
  };
  tipo: 'mascota';
}

type Resultado = Propietario | Mascota;

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<{
    propietarios: Propietario[];
    mascotas: Mascota[];
  }>({ propietarios: [], mascotas: [] });

  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const listaCombinada: Resultado[] = [
    ...resultados.propietarios.map((p) => ({ ...p, tipo: 'propietario' as const })),
    ...resultados.mascotas.map((m) => ({ ...m, tipo: 'mascota' as const })),
  ];

  useEffect(() => {
    if (query.length < 2) {
      setMostrarDropdown(false);
      return;
    }

    const delay = setTimeout(async () => {
      const res = await fetch(`/api/buscar?q=${query}`);
      const data = await res.json();
      setResultados(data);
      setMostrarDropdown(true);
      setHighlightIndex(0);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        limpiarBusqueda();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isInputFocused = document.activeElement === inputRef.current;
      if (!isInputFocused || !mostrarDropdown) return;

      if (event.key === 'Escape') {
        limpiarBusqueda();
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % listaCombinada.length);
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightIndex((prev) =>
          prev <= 0 ? listaCombinada.length - 1 : prev - 1
        );
      }

      if (event.key === 'Enter' && highlightIndex >= 0) {
        const item = listaCombinada[highlightIndex];
        limpiarBusqueda();
        if (item.tipo === 'propietario') {
          router.push(`/propietario/${item.id}`);
        } else {
          router.push(`/mascota/${item.id}`);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [highlightIndex, listaCombinada, mostrarDropdown]);

  const limpiarBusqueda = () => {
    setQuery('');
    setResultados({ propietarios: [], mascotas: [] });
    setMostrarDropdown(false);
    setHighlightIndex(0);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar propietario, mascota o teléfono"
        className="w-full px-5 py-3 bg-gray-100 rounded-full border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500 text-sm transition"
      />

      {mostrarDropdown && (
        <div
          className="absolute top-full left-0 mt-2 w-full rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-xl z-[9999] max-h-64 overflow-y-auto animate-dropdown"
        >
          {listaCombinada.length === 0 && (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              Sin coincidencias
            </div>
          )}

          {resultados.propietarios.length > 0 && (
            <div className="px-4 pt-3 pb-1 text-xs text-gray-500 font-semibold uppercase tracking-wide">
              Propietarios
            </div>
          )}
          {resultados.propietarios.map((p, index) => {
            const globalIndex = index;
            const activo = globalIndex === highlightIndex;
            const telefonoPrincipal = p.telefonos?.find(t => t.esPrincipal)?.numero;
            return (
              <div
                key={p.id}
                onClick={() => {
                  limpiarBusqueda();
                  router.push(`/propietario/${p.id}`);
                }}
                className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-150 ${
                  activo ? 'bg-blue-50' : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">👤</span>
                <span className="flex-1 text-sm font-medium text-gray-900 truncate">
                  {p.nombre}
                  {telefonoPrincipal && (
                    <span className="text-gray-500 text-sm ml-2 whitespace-nowrap">
                      ({telefonoPrincipal})
                    </span>
                  )}
                </span>
              </div>
            );
          })}

          {resultados.mascotas.length > 0 && (
            <div className="px-4 pt-3 pb-1 text-xs text-gray-500 font-semibold uppercase tracking-wide">
              Mascotas
            </div>
          )}
          {resultados.mascotas.map((m, index) => {
            const globalIndex = resultados.propietarios.length + index;
            const activo = globalIndex === highlightIndex;
            return (
              <div
                key={m.id}
                onClick={() => {
                  limpiarBusqueda();
                  router.push(`/mascota/${m.id}`);
                }}
                className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-150 ${
                  activo ? 'bg-blue-50' : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">🐶</span>
                <span className="flex-1 text-sm font-medium text-gray-900 truncate">
                  {m.nombre}
                  {m.propietario?.nombre && (
                    <span className="text-gray-500 text-sm ml-2 whitespace-nowrap">
                      ({m.propietario.nombre})
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
