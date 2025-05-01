'use client'

import Link from 'next/link'
import { Home, Search, Users, PlusSquare } from 'lucide-react'
import { motion } from 'framer-motion'

const menuItems = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/buscar', label: 'Buscar', icon: Search },
  { href: '/mascotas', label: 'Mascotas', icon: Users },
  { href: '/nueva', label: 'Nuevo', icon: PlusSquare },
]

export default function Sidebar({
  contraido = false,
  setContraido,
  setBuscadorAbierto,
}: {
  contraido?: boolean
  setContraido: (val: boolean) => void
  setBuscadorAbierto: (val: boolean) => void
}) {
  return (
    <motion.aside
      animate={{ width: contraido ? 80 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="p-4 flex flex-col gap-4 overflow-hidden"
      style={{ width: contraido ? 80 : 256, backgroundColor: '#1c2c34', color: 'white' }}
    >
      <h1 className="text-xl font-light mb-60">{!contraido && 'Expediente Lsuna'}</h1>
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
                <Icon className="w-5 h-5 text-white" />
                {!contraido && <span className="text-sm font-medium text-white">{label}</span>}
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
              <Icon className="w-5 h-5 text-white" />
              {!contraido && <span className="text-sm font-medium text-white">{label}</span>}
            </Link>
          )
        })}
      </nav>
    </motion.aside>
  )
}
