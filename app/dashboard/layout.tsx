"use client"

import { ReactNode, useState } from "react"
import Sidebar from "@/components/Sidebar"
import BuscadorEmergente from "@/components/BuscadorEmergente"
import FormularioNuevoPropietario from "@/components/FormularioNuevoPropietario"
import VistaPropietario from "@/components/VistaPropietario"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarContraido, setSidebarContraido] = useState(false)
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const [formularioActivo, setFormularioActivo] = useState(false)

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
        setFormularioActivo={setFormularioActivo}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 relative p-6">
        <BuscadorEmergente abierto={buscadorAbierto} setAbierto={handleBuscadorChange} />
        <FormularioNuevoPropietario
          visible={formularioActivo}
          onClose={() => setFormularioActivo(false)}
        />
                <VistaPropietario />
        {children}
      </main>
    </div>
  )
}
