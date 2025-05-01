'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SearchBar from './SearchBar'

export default function BuscadorEmergente({
  abierto,
  setAbierto,
}: {
  abierto: boolean
  setAbierto: (val: boolean) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cerrar con Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setAbierto(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setAbierto])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setAbierto])

  // Hacer focus automático al input cuando se abre
  useEffect(() => {
    if (abierto && inputRef.current) {
      inputRef.current.focus()
    }
  }, [abierto])

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          key="buscador"
          ref={panelRef}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 w-full md:w-1/2 lg:w-1/3 h-full bg-white shadow-lg z-50 p-6 border-r border-gray-200"
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setAbierto(false)}
              className="text-sm text-gray-500 hover:text-black"
            >
              Cerrar ✕
            </button>
          </div>
          <SearchBar inputRef={inputRef} onClose={() => setAbierto(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
