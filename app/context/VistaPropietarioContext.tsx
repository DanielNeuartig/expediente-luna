'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

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

type Propietario = {
  id: number
  nombre: string
  telefonos: Telefono[]
  mascotas: Mascota[]
}

type ContextoExpediente = {
  propietario: Propietario | null
  mostrar: boolean
  mostrarExpediente: (p: Propietario) => void
  cerrarExpediente: () => void
}

const ExpedienteContext = createContext<ContextoExpediente | undefined>(undefined)

export function useVistaPropietario() {
  const context = useContext(ExpedienteContext)
  if (!context) {
    throw new Error('useVistaPropietario debe usarse dentro de VistaPropietarioProvider')
  }
  return context
}

export function VistaPropietarioProvider({ children }: { children: ReactNode }) {
  const [propietario, setPropietario] = useState<Propietario | null>(null)
  const [mostrar, setMostrar] = useState(false)

  const mostrarExpediente = useCallback((p: Propietario) => {
    setPropietario(p)
    setMostrar(true)
  }, [])

  const cerrarExpediente = useCallback(() => {
    setMostrar(false)
    setPropietario(null)
  }, [])

  return (
    <ExpedienteContext.Provider value={{ propietario, mostrar, mostrarExpediente, cerrarExpediente }}>
      {children}
    </ExpedienteContext.Provider>
  )
}
