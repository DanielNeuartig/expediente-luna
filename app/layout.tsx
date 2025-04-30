
import './globals.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="relative z-0">
      <body className="flex bg-gray-100 min-h-screen text-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <Header />
          <main className="flex-1 p-8 bg-gray-50 overflow-y-auto relative z-0 isolation-isolate">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
