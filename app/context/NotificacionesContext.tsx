'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'

export type TipoNotificacion = 'success' | 'error' | 'info' | 'warning'

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  mensaje: string
  duracion?: number
}

interface ContextoProps {
  notificar: (n: Omit<Notificacion, 'id'>) => void
}

const NotificacionesContext = createContext<ContextoProps | null>(null)

export function useNotificaciones() {
  const ctx = useContext(NotificacionesContext)
  if (!ctx) throw new Error('useNotificaciones debe usarse dentro de <NotificacionesProvider>')
  return ctx
}

export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])

  const notificar = ({ tipo, mensaje, duracion = 3500 }: Omit<Notificacion, 'id'>) => {
    const nueva: Notificacion = {
      id: Math.random().toString(36).substr(2, 9),
      tipo,
      mensaje,
      duracion,
    }
    setNotificaciones((prev) => [...prev, nueva])
    setTimeout(() => {
      setNotificaciones((prev) => prev.filter((n) => n.id !== nueva.id))
    }, duracion)
  }

  return (
    <NotificacionesContext.Provider value={{ notificar }}>
      {children}
      <div className="fixed top-3.5 right-4 z-[1000] space-y-2">
        <AnimatePresence>
          {notificaciones.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`flex items-center gap-2 p-3.5 rounded shadow-md max-w-sm mb-3 bg-[var(--color-bgS)] ${n.tipo === 'success' ? 'bg-[var(--color-d)]' : ''} ${n.tipo === 'error' ? 'bg-[var(--color-error)]' : ''} ${n.tipo === 'info' ? 'bg-[var(--color-warn)]' : ''} text-[var(--color-text)]
                ${n.tipo === 'success' ? 'bg-[var(--color-d)]' : ''}
                ${n.tipo === 'error' ? 'bg-[var(--color-error)]' : ''}
                ${n.tipo === 'info' ? 'bg-[var(--color-bgS)]' : ''}
                ${n.tipo === 'warning' ? 'bg-[var(--color-warn)]' : ''}`}
            >
              {n.tipo === 'success' && <CheckCircle className="mt-0.5 w-8 h-8" />}
              {n.tipo === 'error' && <XCircle className="mt-0.5 w-8 h-8" />}
              {n.tipo === 'info' && <Info className="mt-0.5 w-8 h-8" />}
              {n.tipo === 'warning' && <AlertTriangle className="mt-0.5 w-8 h-8" />}
              <div className="text-sm font-medium leading-tight flex items-center h-full">
                {n.mensaje}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificacionesContext.Provider>
  )
}
