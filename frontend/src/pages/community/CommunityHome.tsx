import { useLocation } from 'wouter';
import { Users, Heart, Zap, ArrowRight } from 'lucide-react';

export default function CommunityHome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">ClaunNetworking</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setLocation('/community/login')}
              className="px-6 py-2 text-purple-600 font-semibold hover:bg-purple-50 rounded-lg transition"
            >
              Entrar
            </button>
            <button
              onClick={() => setLocation('/community/signup')}
              className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
            >
              Cadastrar-se
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Rede Colaborativa de Carreira
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Conecte-se com profissionais, compartilhe oportunidades e cresça juntos. Uma comunidade acolhedora focada em desenvolvimento profissional e indicações reais.
          </p>
          <button
            onClick={() => setLocation('/community/signup')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            Começar Agora <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
            <Users className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Conecte-se</h3>
            <p className="text-gray-600">
              Encontre profissionais com interesses e objetivos similares aos seus.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
            <Heart className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Colabore</h3>
            <p className="text-gray-600">
              Ajude e seja ajudado. Compartilhe experiências, dicas e oportunidades.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
            <Zap className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cresça</h3>
            <p className="text-gray-600">
              Evolua profissionalmente com indicações reais e networking genuíno.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <p className="text-purple-100">Profissionais Conectados</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-purple-100">Oportunidades Compartilhadas</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <p className="text-purple-100">Conexões Realizadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Pronto para fazer parte da comunidade?
        </h3>
        <p className="text-gray-600 mb-8">
          Cadastre-se agora e comece a conectar com profissionais que compartilham seus objetivos.
        </p>
        <button
          onClick={() => setLocation('/community/signup')}
          className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
        >
          Cadastrar-se Gratuitamente
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 ClaunNetworking. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
