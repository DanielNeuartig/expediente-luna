"use client"

import { ReactNode, useState } from "react"
import Sidebar from "@/components/Sidebar"
import BuscadorEmergente from "@/components/BuscadorEmergente"
import FormularioNuevoPropietario from "@/components/FormularioNuevoPropietario"
import VistaPropietario from "@/components/VistaPropietario"
import { ContenedorRefProvider } from "@/context/ContenedorRefContext"
import FormularioNuevaMascota from "@/components/FormularioNuevaMascota"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarContraido, setSidebarContraido] = useState(false)
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const [formularioActivo, setFormularioActivo] = useState(false)
  const [formularioMascotaActivo, setFormularioMascotaActivo] = useState<number | null>(null)

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
      <ContenedorRefProvider>
        <main className="flex-1 h-full min-h-screen overflow-y-auto bg-[var(--color-text)] relative p-6">
          <BuscadorEmergente abierto={buscadorAbierto} setAbierto={handleBuscadorChange} />
          <FormularioNuevoPropietario
            visible={formularioActivo}
            onClose={() => setFormularioActivo(false)}
          />
          <VistaPropietario setFormularioMascotaActivo={setFormularioMascotaActivo} />
          {formularioMascotaActivo !== null && (
            <FormularioNuevaMascota
              visible={true}
              propietarioId={formularioMascotaActivo}
              onClose={() => setFormularioMascotaActivo(null)}
            />
          )}
          {children}
        </main>
      </ContenedorRefProvider>
    </div>
  )
}
