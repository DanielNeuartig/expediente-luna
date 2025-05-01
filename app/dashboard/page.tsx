'use client'

import { useState } from 'react'
import BuscadorEmergente from '@/components/BuscadorEmergente'
import FormularioNuevoPropietario from '@/components/FormularioNuevoPropietario'

export default function DashboardPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  return (
    <>
      <BuscadorEmergente />
      
      {mostrarFormulario && (
        {/*<FormularioNuevoPropietario onClose={() => setMostrarFormulario(false)} />*/}
      )}
    </>
  ) 
}
