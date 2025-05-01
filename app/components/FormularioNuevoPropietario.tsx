'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotificaciones } from '@/context/NotificacionesContext'

export default function FormularioNuevoPropietario({
  onClose,
  visible,
}: {
  onClose: () => void
  visible: boolean
}) {
  const { notificar } = useNotificaciones();
  const [nombre, setNombre] = useState('')
  const [telefonos, setTelefonos] = useState([{ numero: '' }])
    
  const resetFormulario = () => {
    setNombre('')
    setTelefonos([{ numero: '' }])
    
    onClose();
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (visible && e.key === 'Escape') {
        resetFormulario()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [visible, onClose])

  useEffect(() => {
    if (!visible) {
      resetFormulario()
    }
  }, [visible])

  const agregarTelefono = () => {
    if (telefonos.length < 3) {
      setTelefonos([...telefonos, { numero: '' }])
    }
  }

  const actualizarTelefono = (index: number, valor: string) => {
    if (/^\d{0,10}$/.test(valor)) {
      const nuevos = [...telefonos]
      nuevos[index].numero = valor
      setTelefonos(nuevos)
    }
  }

  const eliminarTelefono = (index: number) => {
    if (index === 0) return
    const nuevos = telefonos.filter((_, i) => i !== index)
    setTelefonos(nuevos)
  }

  const getEtiqueta = (index: number) => {
    if (index === 0) return 'Principal *'
    if (index === 1) return 'Segundo (opcional)'
    if (index === 2) return 'Tercero (opcional)'
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
  console.log('handleSubmit ejecutado');
    e.preventDefault()

    if (!nombre.trim()) {
      notificar({ tipo: 'error', mensaje: 'El nombre del propietario es obligatorio.' })
      return
    }

    if (telefonos[0].numero.length !== 10) {
      notificar({ tipo: 'error', mensaje: 'El número principal debe tener exactamente 10 dígitos.' })
      return
    }

    
      }

  const confirmarEnvio = () => {
    const datos = {
      nombre,
      telefonos: telefonos
        .filter((t) => t.numero.trim().length === 10)
        .map((t, i) => ({
          numero: t.numero,
          esPrincipal: i === 0,
        })),
    }

    console.log('Guardado:', datos)
    notificar({ tipo: 'success', mensaje: 'Propietario guardado exitosamente.' })
    resetFormulario()
    onClose()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="formulario"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          className="bg-white rounded shadow p-6 max-w-xl w-full mb-6"
        >
          <div className="flex justify-end">
            <button
              onClick={() => {
                resetFormulario()
                onClose()
              }}
              className="text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-6">Nuevo Propietario</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">
                Nombre del propietario <span className="text-red-500">*</span>
              </label>
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
                    inputMode="numeric"
                    pattern="\d{10}"
                    placeholder="10 dígitos"
                    value={tel.numero}
                    onChange={(e) => actualizarTelefono(i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                    required={i === 0}
                  />
                  <span className="text-sm text-gray-500">{getEtiqueta(i)}</span>
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => eliminarTelefono(i)}
                      className="text-red-500 text-sm"
                      title="Eliminar número"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {telefonos.length < 3 && (
                <button
                  type="button"
                  onClick={agregarTelefono}
                  className="text-blue-600 text-sm mt-2"
                >
                  + Añadir otro teléfono
                </button>
              )}
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar propietario
            </motion.button>
          </form>

          </motion.div>
      )}
    </AnimatePresence>
  )
}
