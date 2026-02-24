import { ArrowLeft, Check, FileText } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SellResumeServices() {
  const [, setLocation] = useLocation();
  const { data: products, isLoading } = trpc.products.getByCategory.useQuery({ category: 'candidatos' });

  const handleWantThis = (productId: string) => {
    // Redirecionar para cadastro de candidato antes do checkout
    window.location.href = `/candidate-registration?service=${productId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocation('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Fazer Meu Currículo</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Destaque-se no Mercado
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Crie um currículo profissional que chame atenção dos recrutadores e aumente suas chances de conseguir a oportunidade ideal.
          </p>
        </div>

        {/* Planos Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  product.isPopular ? 'ring-2 ring-green-500 md:scale-105' : ''
                }`}
              >
                {product.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{product.name}</CardTitle>
                  <CardDescription className="text-gray-600">{product.callToAction}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-purple-600">
                      R$ {parseFloat(product.price.toString()).toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-lg text-gray-400 line-through">
                        R$ {parseFloat(product.originalPrice.toString()).toFixed(2)}
                      </span>
                    )}
                    <p className="text-sm text-gray-600 mt-2">{product.duration}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {product.features && (typeof product.features === 'string' ? JSON.parse(product.features) : product.features).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleWantThis(product.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      product.isPopular
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Quero esse
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum serviço disponível no momento.</p>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="bg-purple-50 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Como Funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-purple-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Escolha seu Serviço</h4>
              <p className="text-gray-600">Selecione o tipo de currículo ou serviço que melhor se adequa a você.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Envie seus Dados</h4>
              <p className="text-gray-600">Compartilhe suas informações profissionais e experiências conosco.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Receba seu Currículo</h4>
              <p className="text-gray-600">Seu currículo profissional estará pronto dentro do prazo estimado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Voltar ao Início */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          onClick={() => setLocation('/')}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à Página Inicial
        </Button>
      </section>
    </div>
  );
}
