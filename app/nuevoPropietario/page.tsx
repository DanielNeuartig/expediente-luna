'use client'

import { useState } from 'react'

export default function NuevaPaginaPropietario() {
  const [nombre, setNombre] = useState('')
  const [telefonos, setTelefonos] = useState([{ numero: '', esPrincipal: true }])

  const agregarTelefono = () => {
    setTelefonos([...telefonos, { numero: '', esPrincipal: false }])
  }

  const actualizarTelefono = (
    index: number,
    campo: 'numero' | 'esPrincipal',
    valor: string | boolean
  ) => {
    const nuevos = [...telefonos]
    if (campo === 'esPrincipal') {
      nuevos.forEach((t, i) => {
        t.esPrincipal = i === index
      })
    } else {
      nuevos[index].numero = valor as string
    }
    setTelefonos(nuevos)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ nombre, telefonos })
    // Aquí podrías enviar la data al backend
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6">Nuevo Propietario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre del propietario</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Teléfonos</label>
          {telefonos.map((tel, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Número"
                value={tel.numero}
                onChange={(e) => actualizarTelefono(i, 'numero', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="radio"
                name="telefonoPrincipal"
                checked={tel.esPrincipal}
                onChange={() => actualizarTelefono(i, 'esPrincipal', true)}
              />
              <span className="text-sm">Principal</span>
            </div>
          ))}
          <button
            type="button"
            onClick={agregarTelefono}
            className="text-blue-600 text-sm mt-2"
          >
            + Añadir otro teléfono
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar propietario
        </button>
      </form>
    </div>
  )
}
