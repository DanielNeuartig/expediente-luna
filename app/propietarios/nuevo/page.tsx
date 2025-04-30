'use client';

import { useState } from 'react';

export default function RegistroPropietario() {
  const [nombre, setNombre] = useState('');
  const [telefonos, setTelefonos] = useState(['']);

  const agregarTelefono = () => {
    setTelefonos([...telefonos, '']);
  };

  const quitarTelefono = (index: number) => {
    const nuevos = telefonos.filter((_, i) => i !== index);
    setTelefonos(nuevos);
  };

  const actualizarTelefono = (index: number, valor: string) => {
    const nuevos = [...telefonos];
    nuevos[index] = valor;
    setTelefonos(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/propietarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefonos }),
    });
    if (response.ok) {
      alert('Propietario registrado con éxito');
      setNombre('');
      setTelefonos(['']);
    } else {
      alert('Error al registrar propietario');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Registrar Propietario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border rounded-xl p-2"
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Teléfonos</label>
          {telefonos.map((tel, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tel}
                onChange={(e) => actualizarTelefono(index, e.target.value)}
                required
                placeholder="Ej. 555-123-4567"
                className="flex-1 border rounded-xl p-2"
              />
              {telefonos.length > 1 && (
                <button
                  type="button"
                  onClick={() => quitarTelefono(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={agregarTelefono}
            className="text-blue-600 hover:text-blue-800 text-sm mt-1"
          >
            + Añadir otro teléfono
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
        >
          Guardar propietario
        </button>
      </form>
    </div>
  );
}
