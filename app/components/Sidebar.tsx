"use client"

import Link from "next/link"
import { Home, Search, Users, PlusSquare } from "lucide-react"

const menuItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/mascotas", label: "Mascotas", icon: Users },
  { href: "/nueva", label: "Nuevo", icon: PlusSquare },
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
    <aside className={`border-r p-4 flex flex-col gap-4 transition-all duration-300 ${contraido ? "w-20" : "w-64"}`}>
      <h1 className="text-xl font-bold mb-6">{!contraido && "Expediente Luna"}</h1>
      <nav className="flex flex-col gap-2">
        {menuItems.map(({ href, label, icon: Icon }) => {
          if (label === "Buscar") {
            return (
              <button
                key={href}
                onClick={() => {
                  setBuscadorAbierto(true)
                  setContraido(true)
                }}
                
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-left w-full"
              >
                <Icon className="w-5 h-5" />
                {!contraido && <span className="text-sm font-medium">{label}</span>}
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Icon className="w-5 h-5" />
              {!contraido && <span className="text-sm font-medium">{label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
