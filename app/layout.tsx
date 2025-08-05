import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  display: "swap",
});

export const metadata: Metadata = {
  title: "Next.js App with OpenAI",
  description: "A simple Next.js application integrated with OpenAI API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={montserrat.className}>
      <body className="min-h-screen !bg-blue-900 text-white flex flex-col">
        {/* Navbar */}
        <nav className="bg-blue-800 shadow-md py-4 px-6 flex justify-center gap-6 text-sm sm:text-base">
          <a href="/" className="hover:text-yellow-300 transition font-bold text-white">
            Início
          </a>
          <a href="/chat" className="hover:text-yellow-300 transition font-bold text-white">
            Chat
          </a>
          <a href="/image-generation" className="hover:text-yellow-300 transition font-bold text-white">
            Imagem
          </a>
          <a href="/analysis" className="hover:text-yellow-300 transition font-bold text-white">
            Análise
          </a>
        </nav>

        {/* Conteúdo principal */}
        <main className="flex-1 container mx-auto p-4 sm:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
