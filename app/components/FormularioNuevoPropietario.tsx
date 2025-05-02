'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotificaciones } from '@/context/NotificacionesContext'
import { guardarPropietario } from '@/app/lib/api/guardarPropietario'
import { useVistaPropietario } from '@/context/VistaPropietarioContext'

export default function FormularioNuevoPropietario({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const { mostrarExpediente } = useVistaPropietario();
  const { notificar } = useNotificaciones()
  const [nombre, setNombre] = useState('')
  const [telefonos, setTelefonos] = useState([{ numero: '' }])
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [cargando, setCargando] = useState(false)

  const obtenerTelefonosValidos = () =>
    telefonos.map(t => limpiarNumero(t.numero)).filter(n => n.length === 10)

  useEffect(() => {
    if (!visible) setMostrarConfirmacion(false)
  }, [visible])

  const nombreRef = useRef<HTMLInputElement>(null)

  const capitalizarNombre = (texto: string) =>
    texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())

  const limpiarNumero = (valor: string) =>
    valor.replace(/\D/g, '').slice(0, 10)

  const formatearTelefonoVisual = (numero: string) =>
    numero.replace(/(\d{2})(?=\d)/g, '$1 ').trim()

  const resetConfirmacion = () => setMostrarConfirmacion(false)

  const manejarCambioNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(capitalizarNombre(e.target.value))
    resetConfirmacion()
  }

  const actualizarTelefono = (i: number, valor: string) => {
    const nuevos = telefonos.map((t, idx) =>
      idx === i ? { ...t, numero: limpiarNumero(valor) } : t
    )
    setTelefonos(nuevos)
    resetConfirmacion()
  }

  const agregarTelefono = () => {
    if (telefonos.length < 3) {
      setTelefonos([...telefonos, { numero: '' }])
      resetConfirmacion()
    }
  }

  const eliminarTelefono = (i: number) => {
    const nuevos = telefonos.filter((_, idx) => idx !== i)
    setTelefonos(nuevos)
    resetConfirmacion()
  }

  const cerrarFormulario = () => {
    setNombre('')
    setTelefonos([{ numero: '' }])
    resetConfirmacion()
    onClose()
  }

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible && nombreRef.current) nombreRef.current.focus()
  }, [visible])

  useEffect(() => {
    const enterListener = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && mostrarConfirmacion) {
        e.preventDefault()
        confirmarEnvio()
      }
    }
    document.addEventListener('keydown', enterListener)
    return () => document.removeEventListener('keydown', enterListener)
  }, [mostrarConfirmacion])

  useEffect(() => {
    const escListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const clickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('keydown', escListener)
    document.addEventListener('mousedown', clickOutside)
    return () => {
      document.removeEventListener('keydown', escListener)
      document.removeEventListener('mousedown', clickOutside)
    }
  }, [onClose])

  const validar = (): string[] => {
    const errores: string[] = []
    if (nombre.trim().split(' ').filter(Boolean).length < 2)
      errores.push('El nombre debe contener al menos dos palabras.')
    const principal = limpiarNumero(telefonos[0].numero)
    if (principal.length !== 10)
      errores.push('El teléfono principal debe tener 10 dígitos.')
    const incompletos = telefonos.some(t => {
      const n = limpiarNumero(t.numero)
      return n.length > 0 && n.length < 10
    })
    if (incompletos)
      errores.push('Hay teléfonos incompletos. Completa o elimina los números.')
    return errores
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errores = validar()
    if (errores.length) {
      errores.forEach(m => notificar({ tipo: 'info', mensaje: m }))
      return
    }
    setMostrarConfirmacion(true)
  }

  const confirmarEnvio = async () => {
    if (cargando) return;
    setCargando(true);
    notificar({ tipo: 'info', mensaje: 'Guardando propietario...' });
    const datos = {
      nombre,
      telefonos: telefonos
        .map((t, i) => ({
          numero: limpiarNumero(t.numero),
          esPrincipal: i === 0
        }))
        .filter(t => t.numero.length === 10)
    }

    const res = await guardarPropietario(datos.nombre, datos.telefonos)
    if (res.ok) {
      notificar({ tipo: 'success', mensaje: 'Propietario guardado exitosamente.' })
      mostrarExpediente({ id: 0, nombre, telefonos: datos.telefonos.map((t, i) => ({ ...t, id: i })), mascotas: [] })
      cerrarFormulario()
      setCargando(false)
    } else {
      notificar({ tipo: 'error', mensaje: res.error });
      setCargando(false)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={wrapperRef}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-[var(--color-bg)] rounded-2xl border border-[var(--color-d)] shadow p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Nuevo propietario</h2>
            <button onClick={cerrarFormulario} className="!!text-[var(--color-text)] text-2xl font-light">×</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              ref={nombreRef}
              type="text"
              placeholder="Nombre del propietario"
              value={nombre}
              onChange={manejarCambioNombre}
              className="w-full mt-4 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]"
            />
            {telefonos.map((tel, i) => (
              <div key={i} className="relative">
                <input
                  type="text"
                  value={formatearTelefonoVisual(tel.numero)}
                  onChange={(e) => actualizarTelefono(i, e.target.value)}
                  placeholder={i === 0 ? 'Teléfono principal' : 'Teléfono adicional'}
                  className="w-full mt-4 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]"
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => eliminarTelefono(i)}
                    className="absolute top-1 right-2 text-[var(--color-error)] text-xl font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {telefonos.length < 3 && (
              <button
                type="button"
                onClick={agregarTelefono}
                className="px-4 py-1 text-sm rounded bg-[var(--color-d)] !text-[var(--color-text)]"
              >
                Añadir otro teléfono
              </button>
            )}
            <div className="flex justify-end gap-4">
              <button type="button" onClick={cerrarFormulario} className="px-4 py-2 bg-[var(--color-error)] !text-[var(--color-text)] rounded-lg">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-[var(--color-d)] !text-[var(--color-text)] rounded-lg">Guardar propietario</button>
            </div>
          </form>

          <AnimatePresence>
            {mostrarConfirmacion && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 border bg-[var(--color-bgS)] !text-[var(--color-text)] rounded-lg"
              >
                <h3 className="font-medium mb-2">¿Confirmar los datos?</h3>
                <p><strong className="text-[var(--color-d)]">Nombre:</strong> {nombre}</p>
                {telefonos
                  .map(t => limpiarNumero(t.numero))
                  .filter(num => num.length === 10)
                  .map((num, i) => (
                    <p key={i}>
                      <strong className="text-[var(--color-d)]">Teléfono {i === 0 ? 'principal' : 'adicional'}:</strong>{' '}
                      {formatearTelefonoVisual(num)}
                    </p>
                  ))}
                <div className="flex justify-end gap-4 mt-4">
                  <button onClick={confirmarEnvio} disabled={cargando} className="px-4 py-2 bg-[var(--color-d)] !text-[var(--color-text)] rounded-lg">
                    {cargando ? (<span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-[var(--color-text)]" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Guardando...</span>) : "Confirmar y guardar"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
