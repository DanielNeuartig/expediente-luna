'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white p-6 shadow-md min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🐾 Expediente Luna</h1>
      <nav className="flex flex-col gap-4 text-gray-700">
        <Link href="/" className="hover:text-blue-600">Inicio</Link>
        <Link href="/nueva/propietario" className="hover:text-blue-600">+ Nuevo Propietario</Link>
      </nav>
    </aside>
  );
}
