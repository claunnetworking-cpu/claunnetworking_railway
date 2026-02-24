import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Privacy() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-primary text-white py-8 md:py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/')}
              className="mb-4 text-white/80 hover:text-white transition flex items-center gap-2"
            >
              ← Voltar
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">LGPD - Política de Privacidade</h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-primary px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-primary mb-4">Política de Privacidade e LGPD</h2>

              <h3 className="text-xl font-bold text-primary mt-6 mb-3">1. Introdução</h3>
              <p className="text-gray-700 mb-4">
                A ClaunNetworking ("nós", "nosso" ou "nos") está comprometida com a proteção de seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e salvaguardamos suas informações quando você acessa nosso site.
              </p>

              <h3 className="text-xl font-bold text-primary mt-6 mb-3">2. Informações que Coletamos</h3>
              <p className="text-gray-700 mb-4">Podemos coletar informações sobre você de várias formas, incluindo:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Informações fornecidas voluntariamente (nome, email, telefone)</li>
                <li>Dados de navegação (cookies, endereço IP, tipo de navegador)</li>
                <li>Informações de cliques em vagas e cursos</li>
                <li>Dados de localização (opcional)</li>
              </ul>

              <h3 className="text-xl font-bold text-primary mt-6 mb-3">3. Como Usamos Suas Informações</h3>
              <p className="text-gray-700 mb-4">Usamos as informações coletadas para:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar suas solicitações</li>
                <li>Enviar comunicações relevantes</li>
                <li>Analisar o uso do site</li>
                <li>Cumprir obrigações legais</li>
              </ul>

              <h3 className="text-xl font-bold text-primary mt-6 mb-3">4. Seus Direitos</h3>
              <p className="text-gray-700 mb-4">De acordo com a LGPD, você tem direito a:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados imprecisos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar seu consentimento</li>
                <li>Portabilidade de dados</li>
              </ul>

              <h3 className="text-xl font-bold text-primary mt-6 mb-3">5. Contato</h3>
              <p className="text-gray-700 mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato conosco em: <strong>contato@claunnetworking.com.br</strong>
              </p>

              <p className="text-gray-600 text-sm mt-8 pt-4 border-t border-gray-200">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
