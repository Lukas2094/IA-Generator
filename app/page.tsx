import Link from 'next/link'
import { AiOutlineRobot } from 'react-icons/ai'
import { MdImage } from 'react-icons/md'
import { BiAnalyse } from 'react-icons/bi'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-10 px-4">
      {/* Título */}
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          🚀 Projeto de IA com Next.js
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl">
          Utilize inteligência artificial para conversar, gerar imagens e analisar textos com tecnologias modernas.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Chat */}
        <Link
          href="/chat"
          className="bg-blue-700 hover:bg-blue-600 transition rounded-xl p-6 shadow-lg flex flex-col items-center space-y-4 text-white"
        >
          <AiOutlineRobot size={64} />
          <h2 className="text-xl font-semibold">Chat com IA</h2>
          <p className="text-sm text-gray-200 text-center">
            Converse com uma IA em linguagem natural. Ideal para perguntas, ideias ou bate-papo.
          </p>
        </Link>

        {/* Geração de Imagens */}
        <Link
          href="/image-generation"
          className="bg-green-700 hover:bg-green-600 transition rounded-xl p-6 shadow-lg flex flex-col items-center space-y-4 text-white"
        >
          <MdImage size={64} />
          <h2 className="text-xl font-semibold">Geração de Imagens</h2>
          <p className="text-sm text-gray-200 text-center">
            Gere imagens incríveis a partir de descrições textuais com IA criativa.
          </p>
        </Link>

        {/* Análise de Texto */}
        <Link
          href="/analysis"
          className="bg-purple-700 hover:bg-purple-600 transition rounded-xl p-6 shadow-lg flex flex-col items-center space-y-4 text-white"
        >
          <BiAnalyse size={64} />
          <h2 className="text-xl font-semibold">Análise de Texto</h2>
          <p className="text-sm text-gray-200 text-center">
            Receba insights, resumos ou sentimentos de textos que você enviar.
          </p>
        </Link>
      </div>
    </div>
  )
}
