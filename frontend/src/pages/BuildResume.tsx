import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BuildResume() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation('/landing')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-900" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ClaunNetworking</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fazer Meu Currículo
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Crie um currículo profissional e destaque-se no mercado de trabalho.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Funcionalidade em Desenvolvimento
            </h3>
            <p className="text-amber-800">
              Este módulo será implementado em breve. Você poderá criar e gerenciar seu currículo de forma simples e intuitiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">O que você pode fazer:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Criar currículo profissional</li>
                <li>✓ Escolher templates</li>
                <li>✓ Exportar em PDF</li>
                <li>✓ Compartilhar online</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Benefícios:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Aumentar chances de contratação</li>
                <li>✓ Apresentação profissional</li>
                <li>✓ Fácil compartilhamento</li>
                <li>✓ Atualizações rápidas</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setLocation('/landing')}
              variant="outline"
            >
              Voltar à Página Inicial
            </Button>
            <Button
              onClick={() => setLocation('/premium-services')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Ver Planos Premium
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
