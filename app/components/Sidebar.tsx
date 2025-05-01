'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, Search, Users, PlusSquare } from 'lucide-react'
import { motion } from 'framer-motion'

const menuItems = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/buscar', label: 'Buscar', icon: Search },
  { href: '/mascotas', label: 'Mascotas', icon: Users },
]

export default function Sidebar({
  contraido = false,
  setContraido,
  setBuscadorAbierto,
  setFormularioActivo,
}: {
  contraido?: boolean
  setContraido: (val: boolean) => void
  setBuscadorAbierto: (val: boolean) => void
  setFormularioActivo: (val: boolean) => void
}) {
  return (
    <motion.aside
      animate={{ width: contraido ? 128 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="p-4 flex flex-col gap-4 overflow-hidden"
      style={{ width: contraido ? 128 : 256, backgroundColor: 'var(--color-bg)', color: 'white' }}
    >
      <div className="flex justify-center items-center mb-4">
        <Image src="/logo.png" alt="Logo" width={contraido ? 64 : 300} height={contraido ? 64 : 300} priority />
      </div>
      <h1 className="text-4xl font-bold mb-2 text-[var(--color-text)]">{!contraido && ''}</h1> 
      <nav className="flex flex-col gap-2">
        {menuItems.map(({ href, label, icon: Icon }) => {
          if (label === 'Buscar') {
            return (
              <button
                key={href}
                onClick={() => {
                  setBuscadorAbierto(true)
                  setContraido(true)
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition text-left w-full"
              >
                <Icon className="w-8 h-8 text-[var(--color-d)]" />
                {!contraido && <span className="text-3xl font-medium text-[var(--color-text)]">{label}</span>}
              </button>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              onClick={() => {
                setContraido(false)
                setBuscadorAbierto(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition"
            >
              <Icon className="w-8 h-8 text-[var(--color-d)]" />
              {!contraido && <span className="text-3xl font-medium text-[var(--color-text)]">{label}</span>}
            </Link>
          )
        })}

        {/* Botón NUEVO propietario */}
        <button
          onClick={() => {
            setFormularioActivo(true)
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition text-left w-full mt-2"
        >
          <PlusSquare className="w-8 h-8 text-[var(--color-d)]" />
          {!contraido && (
            <span className="text-3xl font-medium text-[var(--color-text)]">Nuevo</span>
          )}
        </button>
      </nav>

      {/* Logo inferior fijo y responsivo */}
      <div className="mt-auto flex justify-center pt-4">
        <Image
          src="/logo-pequeno.png"
          alt="Logo inferior"
          width={contraido ? 40 : 64}
          height={contraido ? 40 : 64}
        />
      </div>
    </motion.aside>
  )
}
