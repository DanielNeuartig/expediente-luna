// app/lib/api/guardarPropietario.ts

export async function guardarPropietario(nombre: string, telefonos: { numero: string; esPrincipal: boolean }[]) {
  try {
    const res = await fetch("/api/propietarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, telefonos }),
    })

    if (!res.ok) {
      const data = await res.json()
      return { ok: false, error: data?.error || "Error desconocido" }
    }

    return { ok: true }
  } catch (e) {
    return { ok: false, error: "No se pudo conectar con el servidor" }
  }
}
