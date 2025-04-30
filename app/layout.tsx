import "./globals.css";
import "@fontsource/open-sans";

export const metadata = {
  title: "Expediente Luna",
  description: "Sistema de gestión veterinaria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans bg-[#bebebe] text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
