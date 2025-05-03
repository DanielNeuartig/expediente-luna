'use client'

import { createContext, useContext, useRef, useEffect } from 'react'

type ContenedorRefContextType = {
    refContenedor: React.RefObject<HTMLDivElement | null>
  }

const ContenedorRefContext = createContext<ContenedorRefContextType | null>(null)

export function useContenedorRef() {
  const ctx = useContext(ContenedorRefContext)
  if (!ctx) throw new Error('useContenedorRef debe usarse dentro de un ContenedorRefProvider')
  return ctx
}

export function ContenedorRefProvider({ children }: { children: React.ReactNode }) {
  const refContenedor = useRef<HTMLDivElement>(null)

  return (
    <ContenedorRefContext.Provider value={{ refContenedor }}>
      <div ref={refContenedor} className="relative w-full h-full">
        {children}
      </div>
    </ContenedorRefContext.Provider>
  )
}