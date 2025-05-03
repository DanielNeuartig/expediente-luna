'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useNotificaciones } from '@/context/NotificacionesContext'
import { guardarMascota } from '@/app/lib/api/guardarMascota'
import { useContenedorRef } from '@/context/ContenedorRefContext'

const ESPECIES = [
  { nombre: 'PERRO', icono: '🐶' },
  { nombre: 'GATO', icono: '🐱' },
  { nombre: 'ROEDOR', icono: '🐭' },
  { nombre: 'AVE', icono: '🦜' },
  { nombre: 'REPTIL', icono: '🦎' }
] as const

const SEXOS = ['MACHO', 'HEMBRA', 'INDETERMINADO'] as const

type Props = {
  visible: boolean,
  propietarioId: number,
  onClose: () => void
}

export default function FormularioNuevaMascota({ visible, propietarioId, onClose }: Props) {
  const { notificar } = useNotificaciones()
  const { refContenedor } = useContenedorRef()
  const primerInputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [cargando, setCargando] = useState(false)

  const [datos, setDatos] = useState({
    nombre: '',
    especie: 'PERRO',
    raza: '',
    sexo: 'INDETERMINADO',
    color: '',
    fechaNacimiento: '',
    senasPartic: '',
    notas: '',
    esterilizado: false,
    alergias: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setDatos(prev => ({ ...prev, [name]: newValue }))
  }

  const validar = () => {
    const errores: string[] = []
    if (datos.nombre.trim().length < 2) errores.push('El nombre es obligatorio.')
    return errores
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errores = validar()
    if (errores.length) {
      errores.forEach(m => notificar({ tipo: 'info', mensaje: m }))
      return
    }
    setCargando(true)
    notificar({ tipo: 'info', mensaje: 'Guardando mascota...' })
    const payload = { ...datos, propietarioId, fechaNacimiento: datos.fechaNacimiento ? new Date(datos.fechaNacimiento) : undefined }
    const res = await guardarMascota(payload)
    if (res.ok) {
      notificar({ tipo: 'success', mensaje: 'Mascota guardada exitosamente.' })
      onClose()
    } else {
      notificar({ tipo: 'error', mensaje: res.error })
    }
    setCargando(false)
  }

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  useEffect(() => {
    if (visible && primerInputRef.current) primerInputRef.current.focus()
  }, [visible])

  if (!visible || !refContenedor.current) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={wrapperRef}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute left-[432px] top-0 w-[400px] bg-[var(--color-bg)] rounded-2xl border border-[var(--color-d)] shadow p-6 z-50"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Nueva mascota</h2>
          <button onClick={onClose} className="text-2xl font-light text-[var(--color-text)]">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input ref={primerInputRef} name="nombre" placeholder="Nombre" value={datos.nombre} onChange={handleChange} className="input" />

          <div className="flex gap-2">
            {ESPECIES.map(e => (
              <button
                key={e.nombre}
                type="button"
                onClick={() => setDatos(prev => ({ ...prev, especie: e.nombre }))}
                className={`px-3 py-1 rounded-full border text-sm ${datos.especie === e.nombre ? 'bg-[var(--color-d)] text-white' : 'bg-[var(--color-bgS)] !text-[var(--color-text)] border-[var(--color-d)]'}`}
              >
                {e.icono} {e.nombre}
              </button>
            ))}
          </div>

          <input name="raza" placeholder="Raza" value={datos.raza} onChange={handleChange} className="input" />
          <select name="sexo" value={datos.sexo} onChange={handleChange} className="input">
            {SEXOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input name="color" placeholder="Color" value={datos.color} onChange={handleChange} className="input" />
          <input name="fechaNacimiento" type="date" value={datos.fechaNacimiento} onChange={handleChange} className="input" />
          <textarea name="senasPartic" placeholder="Señas particulares" value={datos.senasPartic} onChange={handleChange} className="input" />
          <textarea name="notas" placeholder="Notas adicionales" value={datos.notas} onChange={handleChange} className="input" />
          <textarea name="alergias" placeholder="Alergias" value={datos.alergias} onChange={handleChange} className="input" />

          <label className="text-[var(--color-text)]">
            <input type="checkbox" name="esterilizado" checked={datos.esterilizado} onChange={handleChange} className="mr-2" />
            Esterilizado
          </label>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[var(--color-error)] !text-[var(--color-text)] rounded-lg">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-d)] !text-[var(--color-text)] rounded-lg">Guardar mascota</button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>,
    refContenedor.current
  )
}
