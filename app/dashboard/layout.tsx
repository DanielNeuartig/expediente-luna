"use client"

import { ReactNode, useState } from "react"
import Sidebar from "@/components/Sidebar"
import BuscadorEmergente from "@/components/BuscadorEmergente"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarContraido, setSidebarContraido] = useState(false)
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)

  const handleBuscadorChange = (abierto: boolean) => {
    setBuscadorAbierto(abierto)
    setSidebarContraido(abierto)
  }

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <Sidebar
        contraido={sidebarContraido}
        setContraido={setSidebarContraido}
        setBuscadorAbierto={setBuscadorAbierto}
      />

      {/* Main content con buscador embebido */}
      <main className="flex-1 overflow-y-auto bg-gray-50 relative p-6">
        <BuscadorEmergente abierto={buscadorAbierto} setAbierto={handleBuscadorChange} />
        {children}
      </main>
    </div>
  )
}
