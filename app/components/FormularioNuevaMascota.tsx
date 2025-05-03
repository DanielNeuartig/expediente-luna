'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useNotificaciones } from '@/context/NotificacionesContext'
import { guardarMascota } from '@/app/lib/api/guardarMascota'
import { useContenedorRef } from '@/context/ContenedorRefContext'

const ESPECIES = [
  { nombre: 'Canino', icono: '🐶' },
  { nombre: 'Felino', icono: '🐱' },
  { nombre: 'Psitácido', icono: '🦜' },
  { nombre: 'Ofidio', icono: '🐍' },
  { nombre: 'Lagomorfo', icono: '🐰' },
  { nombre: 'Lagartija o similar', icono: '🦎' },
  { nombre: 'Quelonio', icono: '🐢' },
  { nombre: 'Roedor', icono: '🐭' }
] as const

export function obtenerIconoEspecie(nombre: string) {
  const especie = ESPECIES.find(e => e.nombre === nombre);
  return especie ? especie.icono : '🐾';
}



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
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)

  const capitalizarNombre = (texto: string) =>
    texto.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())

  const [datos, setDatos] = useState<{
  nombre: string
  especie: string
  raza: string
  sexo: string
  color: string
  fechaNacimiento: string
  senasPartic: string
  notas: string
  esterilizado: boolean | null
  alergias: string
}>({
    nombre: '',
    especie: 'Canino',
    raza: '',
    sexo: 'INDETERMINADO',
    color: '',
    fechaNacimiento: '',
    senasPartic: '',
    notas: '',
    esterilizado: null,
    alergias: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setDatos(prev => ({ ...prev, [name]: newValue }))
    setMostrarConfirmacion(false)
  }

  const validar = () => {
    const errores: string[] = []
    const palabras = datos.nombre.trim().split(/\s+/)
    if (datos.nombre.trim().length < 2 || palabras.length < 2) {
      errores.push('El nombre debe contener al menos dos palabras.')
    }
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

    const payload = {
      ...datos,
      nombre: capitalizarNombre(datos.nombre.trim()),
      propietarioId,
      fechaNacimiento: datos.fechaNacimiento ? new Date(datos.fechaNacimiento) : undefined
    }

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

        <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Enter' && !mostrarConfirmacion) { e.preventDefault(); setMostrarConfirmacion(true); } }} className="space-y-4">
          <input
            ref={primerInputRef}
            name="nombre"
            placeholder="Nombre"
            value={datos.nombre}
            onChange={(e) => {
              const capitalizado = capitalizarNombre(e.target.value)
              setDatos(prev => ({ ...prev, nombre: capitalizado }))
              setMostrarConfirmacion(false)
            }}
            className="w-full mt-2 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]"
          />

          <div className="flex gap-2 flex-wrap">
            {ESPECIES.map(e => (
              <button
                key={e.nombre}
                type="button"
                onClick={() => { setDatos(prev => ({ ...prev, especie: e.nombre })); setMostrarConfirmacion(false); }}
                className={`px-3 py-1 rounded-full border text-sm ${datos.especie === e.nombre ? 'bg-[var(--color-d)] text-white' : 'bg-[var(--color-bgS)] !text-[var(--color-text)] border-[var(--color-d)]'}`}
              >
                {e.icono} {e.nombre}
              </button>
            ))}
          </div>

          <input name="raza" placeholder="Raza" value={datos.raza} onChange={handleChange} className="w-full mt-2 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]" />
          <select name="sexo" value={datos.sexo} onChange={handleChange} className="w-full mt-2 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]">
            {SEXOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input name="color" placeholder="Color" value={datos.color} onChange={handleChange} className="w-full mt-2 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]" />
          <input name="fechaNacimiento" type="date" value={datos.fechaNacimiento} onChange={handleChange} className="w-full mt-2 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]" />
{datos.fechaNacimiento && (
  <div className="text-sm text-[var(--color-text)]">
    Edad: {(() => {
      const hoy = new Date();
      const nacimiento = new Date(datos.fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
      return edad === 0 ? 'Menos de 1 año' : `${edad} año${edad > 1 ? 's' : ''}`;
    })()}
  </div>
)}

          <textarea name="senasPartic" placeholder="Señas particulares" value={datos.senasPartic} onChange={handleChange} className="w-full mt-2 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]" />
          <textarea name="notas" placeholder="Notas adicionales" value={datos.notas} onChange={handleChange} className="w-full mt-2 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]" />
          <textarea name="alergias" placeholder="Alergias" value={datos.alergias} onChange={handleChange} className="w-full mt-2 px-4 py-2 bg-[var(--color-bgS)] border border-[var(--color-d)] !text-[var(--color-text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-d)] placeholder-[var(--color-text)]" />
          <div className="flex gap-2">
  {[
    { estado: true, texto: "Esterilizado", icono: "✅" },
    { estado: false, texto: "No esterilizado", icono: "❌" },
    { estado: null, texto: "Desconocido", icono: "❓" }
  ].map(opcion => (
    <button
      key={String(opcion.estado)}
      type="button"
      onClick={() => {
        setDatos(prev => ({ ...prev, esterilizado: opcion.estado }))
        setMostrarConfirmacion(false)
      }}
      className={`px-3 py-1 rounded-full border text-sm ${
        datos.esterilizado === opcion.estado
          ? 'bg-[var(--color-d)] text-white'
          : 'bg-[var(--color-bgS)] !text-[var(--color-text)] border-[var(--color-d)]'
      }`}
    >
      {opcion.icono} {opcion.texto}
    </button>
  ))}
</div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[var(--color-error)] !text-[var(--color-text)] rounded-lg">Cancelar</button>
            <button type="button" onClick={() => setMostrarConfirmacion(true)} className="px-4 py-2 bg-[var(--color-d)] !text-[var(--color-text)] rounded-lg">Continuar</button>
          </div>

          {mostrarConfirmacion && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-[var(--color-d)] rounded-lg p-4 bg-[var(--color-bgS)] space-y-2"
            >
              <h3 className="text-lg font-semibold">Confirma los datos</h3>
              <ul className="text-sm text-[var(--color-text)] space-y-1">
                <li><strong>Nombre:</strong> {datos.nombre}</li>
                <li><strong>Especie:</strong> {datos.especie}</li>
                <li><strong>Raza:</strong> {datos.raza}</li>
                <li><strong>Sexo:</strong> {datos.sexo}</li>
                <li><strong>Color:</strong> {datos.color}</li>
                <li><strong>Fecha de nacimiento:</strong> {(() => {
  if (!datos.fechaNacimiento) return '';
  const fecha = new Date(datos.fechaNacimiento);
  return fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
})()}</li>
<li><strong>Edad:</strong> {(() => {
  if (!datos.fechaNacimiento) return '—';
  const hoy = new Date();
  const nacimiento = new Date(datos.fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad === 0 ? 'Menos de 1 año' : `${edad} año${edad > 1 ? 's' : ''}`;
})()}</li>
                <li><strong>Señas particulares:</strong> {datos.senasPartic}</li>
                <li><strong>Notas:</strong> {datos.notas}</li>
                <li><strong>Alergias:</strong> {datos.alergias}</li>
                <li><strong>Esterilizado:</strong> {datos.esterilizado ? 'Sí' : 'No'}</li>
              </ul>
              <div className="flex justify-end gap-4 mt-2">
                <button type="button" onClick={() => setMostrarConfirmacion(false)} className="px-4 py-2 bg-[var(--color-error)] text-white rounded-lg">Cancelar</button>
                <button type="submit" disabled={cargando} className="px-4 py-2 bg-[var(--color-d)] text-white rounded-lg disabled:opacity-50">
                  {cargando ? 'Guardando...' : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </AnimatePresence>,
    refContenedor.current
  )
}