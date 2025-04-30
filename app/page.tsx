'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-blue-700">🏠 Bienvenido</h1>
        <p className="text-gray-600 mt-2">Usa el buscador de arriba para encontrar propietarios o mascotas.</p>
      </div>
    );
  }
  