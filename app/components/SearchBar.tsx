'use client'

import { ChangeEvent, useEffect, useState, RefObject } from 'react'
import { useVistaPropietario } from '@/context/VistaPropietarioContext'

type Mascota = {
  id: number
  nombre: string
  propietario: {
    nombre: string
  }
}

type Propietario = {
  id: number
  nombre: string
  telefonos: { numero: string; esPrincipal: boolean }[]
}

export default function SearchBar({
  inputRef,
  onClose,
}: {
  inputRef?: RefObject<HTMLInputElement | null>
  onClose?: () => void
}) {
  const { mostrarExpediente } = useVistaPropietario()

  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<{
    mascotas: Mascota[]
    propietarios: Propietario[]
  }>({ mascotas: [], propietarios: [] })

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim().length === 0) {
        setResultados({ mascotas: [], propietarios: [] })
        return
      }

      fetch(`/api/buscar?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResultados(data))
        .catch(() => setResultados({ mascotas: [], propietarios: [] }))
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const abrirExpedientePropietario = (p: Propietario) => {
    const mascotasDelPropietario = resultados.mascotas.filter(m => m.propietario.nombre === p.nombre)
    const telefonosConId = p.telefonos.map((t, i) => ({ ...t, id: i }))
    mostrarExpediente({
      ...p,
      telefonos: telefonosConId,
      mascotas: mascotasDelPropietario.map((m) => ({ ...m, especie: 'Desconocida' }))
    })
    if (onClose) onClose()
  }

  return (
    <div className="w-full space-y-4">
      <input
        type="text"
        ref={inputRef}
        value={query}
        onChange={handleChange}
        placeholder="Buscar propietario o mascota..."
        className="w-full px-4 py-2 border border-[var(--color-bg)] rounded-md bg-[var(--color-bgS)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bg)]" style={{ color: "var(--color-text)" }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        inputMode="none"
      />

      {(resultados.mascotas.length > 0 || resultados.propietarios.length > 0) && (
        <div className="space-y-3">
          {resultados.propietarios.map((p) => {
            const mascotasDelPropietario = resultados.mascotas.filter(m => m.propietario.nombre === p.nombre)
            return (
              <div
                key={`p-${p.id}`}
                className="bg-[var(--color-bg)] p-4 rounded-md border border-[var(--color-d)] shadow-sm cursor-pointer hover:bg-[var(--color-bgT)]"
                onClick={() => abrirExpedientePropietario(p)}
              >
                <div className="text-lg font-semibold text-[var(--color-text)] flex justify-between">
                  <span>{p.nombre} ({p.telefonos.find((t) => t.esPrincipal)?.numero.replace(/(\d{2})(?=\d)/g, "$1 ").trim()})</span>
                  <span className="text-sm text-[var(--color-text)] bg-[var(--color-bgS)]">
                    
                  </span>
                </div>

                {mascotasDelPropietario.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mascotasDelPropietario.map((m) => (
                      <div key={m.id} className="text-sm text-[var(--color-text)] bg-[var(--color-d)] px-3 py-1 rounded-full">
                        🐶 {m.nombre}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
