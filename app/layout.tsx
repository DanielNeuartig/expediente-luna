import './globals.css'
import { NotificacionesProvider } from '@/context/NotificacionesContext'
import { VistaPropietarioProvider } from '@/context/VistaPropietarioContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.setAttribute('data-theme', 'oscuro');
            `,
          }}
        />
      </head>
      <body className="font-sans bg-[var(--color-bg)] text-[var(--color-bgS)]">
        <NotificacionesProvider>
          <VistaPropietarioProvider>
            {children}
          </VistaPropietarioProvider>
        </NotificacionesProvider>
      </body>
    </html>
  )
}
