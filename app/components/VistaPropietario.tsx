'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import { useVistaPropietario } from '../context/VistaPropietarioContext'

type Telefono = {
  id: number
  numero: string
  esPrincipal: boolean
}

type Mascota = {
  id: number
  nombre: string
  especie: string
}

type Props = {
  setFormularioMascotaActivo: (id: number | null) => void
}

export default function VistaPropietario({ setFormularioMascotaActivo }: Props) {
  const { propietario, mostrar, cerrarExpediente } = useVistaPropietario()

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') cerrarExpediente()
  }, [cerrarExpediente])

  useEffect(() => {
    if (mostrar) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mostrar, handleKey])

  return (
    <AnimatePresence>
      {mostrar && propietario && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 left-4 w-[90%] max-w-xl rounded-2xl shadow-lg z-40 bg-[var(--color-bg)] text-[var(--color-text)] p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{propietario.nombre}</h2>
            <button onClick={cerrarExpediente} className="text-sm">✕</button>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-1">Teléfonos:</h3>
            <ul className="space-y-1">
              {propietario.telefonos.filter((t: Telefono) => t.numero.length === 10).map((t: Telefono) => (
                <li key={t.id}>
                  {(t.numero.match(/.{1,2}/g) || []).join(' ')} {t.esPrincipal ? '(Principal)' : ''}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">Mascotas:</h3>
            <ul className="space-y-1">
              {propietario.mascotas.map((m: Mascota) => (
                <li key={m.id}>• {m.nombre} – {m.especie}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setFormularioMascotaActivo(propietario.id)}
              className="px-4 py-2 bg-[var(--color-d)] text-[var(--color-text)] rounded-lg"
            >
              Registrar nueva mascota
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}