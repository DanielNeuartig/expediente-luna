import './globals.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex bg-gray-100 min-h-screen text-gray-900">
        {/* Barra lateral */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex flex-col flex-1 min-h-screen">
          <Header />

          <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
