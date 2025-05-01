'use client'

import { ChangeEvent, useEffect, useState, RefObject } from 'react'

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
  inputRef?: RefObject<HTMLInputElement>
  onClose?: () => void
}) {
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

  const handleClickResultado = () => {
    if (onClose) onClose()
  }

  return (
    <div className="w-full space-y-4">
      <input
        type="text"
        ref={inputRef}
        value={query}
        onChange={handleChange}
        placeholder="Buscar por nombre o teléfono..."
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {(resultados.mascotas.length > 0 || resultados.propietarios.length > 0) && (
        <div className="space-y-2">
          {resultados.propietarios.map((p) => (
            <div
              key={`p-${p.id}`}
              className="bg-gray-100 p-2 rounded shadow-sm text-sm cursor-pointer hover:bg-gray-200"
              onClick={handleClickResultado}
            >
              👤 {p.nombre}{' '}
              {p.telefonos.find((t) => t.esPrincipal)?.numero
                ? `(${p.telefonos.find((t) => t.esPrincipal)?.numero})`
                : ''}
            </div>
          ))}

          {resultados.mascotas.map((m) => (
            <div
              key={`m-${m.id}`}
              className="bg-blue-100 p-2 rounded shadow-sm text-sm cursor-pointer hover:bg-blue-200"
              onClick={handleClickResultado}
            >
              🐶 {m.nombre} – {m.propietario.nombre}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
