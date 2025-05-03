export const guardarMascota = async (datos: any) => {
    try {
      const res = await fetch('/api/guardar-mascota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      return await res.json();
    } catch (e) {
      return { ok: false, error: 'Error de red o del servidor' };
    }
  };