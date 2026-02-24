import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Check, Building2, Users, Briefcase, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  tier: 'starter' | 'professional' | 'premium';
  isPopular: boolean;
  callToAction?: string;
  description: string;
  duration?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
}

const iconMap: Record<string, any> = {
  Building2,
  Users,
  Briefcase,
  BookOpen,
};

const colorMap: Record<string, string> = {
  empresas: 'from-blue-500 to-blue-600',
  mentores: 'from-orange-500 to-orange-600',
  candidatos: 'from-green-500 to-green-600',
  ensino: 'from-pink-500 to-pink-600',
};

export default function PremiumServices() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [plansByCategory, setPlansByCategory] = useState<Record<string, Plan[]>>({});

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = trpc.products.getCategories.useQuery();

  // Fetch all products
  const { data: allProducts, isLoading: productsLoading } = trpc.products.getAll.useQuery();

  useEffect(() => {
    if (categoriesData) {
      const cats = categoriesData as any[];
      setCategories(cats);
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0].slug);
      }
    }
  }, [categoriesData, selectedCategory]);

  useEffect(() => {
    if (allProducts) {
      const grouped: Record<string, Plan[]> = {};
      
      categories.forEach((cat) => {
        grouped[cat.slug] = allProducts
          .filter((p: any) => p.categoryId === cat.id)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
            features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features) : []),
            tier: p.tier,
            isPopular: p.isPopular,
            callToAction: p.callToAction,
            description: p.description,
            duration: p.duration,
          }));
      });

      setPlansByCategory(grouped);
    }
  }, [allProducts, categories]);

  const isLoading = categoriesLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-purple-700 text-white py-12 md:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Serviços Premium
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
              Escolha o plano perfeito para impulsionar sua presença na Claunnetworking
            </p>
          </div>
        </section>

        {/* Categories Tabs */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === cat.slug
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {selectedCategory && (
              <>
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {categories.find((c) => c.slug === selectedCategory)?.description}
                  </p>
                </div>

                {plansByCategory[selectedCategory] && plansByCategory[selectedCategory].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plansByCategory[selectedCategory].map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                          plan.isPopular ? 'border-primary lg:scale-105' : 'border-gray-200'
                        }`}
                      >
                        {/* Popular Badge */}
                        {plan.isPopular && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                            ⭐ Popular
                          </div>
                        )}

                        {/* Plan Content */}
                        <div className="p-6 md:p-8">
                          {/* Tier Badge */}
                          <div className="inline-block mb-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                plan.tier === 'starter'
                                  ? 'bg-blue-100 text-blue-800'
                                  : plan.tier === 'professional'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {plan.tier === 'starter'
                                ? 'Iniciante'
                                : plan.tier === 'professional'
                                  ? 'Profissional'
                                  : 'Premium'}
                            </span>
                          </div>

                          {/* Plan Name */}
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                          {/* Call to Action */}
                          {plan.callToAction && (
                            <p className="text-sm text-gray-600 italic mb-3">{plan.callToAction}</p>
                          )}

                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                          {/* Price */}
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-primary">
                              R$ {plan.price.toFixed(2)}
                            </span>
                            {plan.duration && (
                              <p className="text-sm text-gray-500 mt-1">
                                ⏱️ {plan.duration}
                              </p>
                            )}
                          </div>

                          {/* Features */}
                          <div className="mb-6 space-y-3">
                            {plan.features && plan.features.length > 0 ? (
                              plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-700">{feature}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">Sem benefícios listados</p>
                            )}
                          </div>

                          {/* CTA Button */}
                          <Button
                            onClick={() => {
                              // Aqui você pode adicionar lógica de compra/checkout
                              alert(`Plano "${plan.name}" selecionado! Redirecionando para checkout...`);
                            }}
                            className={`w-full py-3 rounded-lg font-bold transition ${
                              plan.isPopular
                                ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            {plan.isPopular ? 'Escolher Plano' : 'Saiba Mais'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Nenhum plano disponível para esta categoria</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-12 md:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">Posso cancelar meu plano a qualquer momento?</h3>
                <p className="text-gray-600">
                  Sim, você pode cancelar seu plano a qualquer momento. Não há taxas de cancelamento.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">Qual é a diferença entre os planos?</h3>
                <p className="text-gray-600">
                  Cada plano oferece diferentes níveis de visibilidade, alcance e recursos. Escolha o que melhor se adequa às suas necessidades.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2">Como faço para contratar um plano?</h3>
                <p className="text-gray-600">
                  Clique no botão "Escolher Plano" e siga as instruções de checkout. Você receberá confirmação por email.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
