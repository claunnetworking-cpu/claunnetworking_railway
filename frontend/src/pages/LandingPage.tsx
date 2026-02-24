import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Briefcase, Users, BookOpen, FileText, Search, Eye, TrendingUp, BarChart3, LogIn, Zap, User, Wifi, Monitor } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';

// Função para formatar números em formato brasileiro (307,2 mil, 5,3 mil, etc)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil';
  }
  return num.toString();
};

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [displayedStats, setDisplayedStats] = useState({
    visualizacoes: 0,
    novosSeguidor: 0,
    conteudoCompartilhado: 0,
    vagasAtivas: 0,
    vagasHomeOffice: 0,
    acessosSite: 0,
  });

  // Buscar dados de Instagram da API
  const { data: socialMetrics = [] } = trpc.socialMedia.getAll.useQuery(undefined, {
    refetchOnMount: true,
    staleTime: 0,
  });
  
  // Buscar estatísticas de vagas
  const { data: stats } = trpc.stats.getOverview.useQuery(undefined, {
    refetchOnMount: true,
    staleTime: 0,
  });

  // Encontrar dados do Instagram
  const instagramData = useMemo(() => {
    return socialMetrics.find((m: any) => m.platform === 'instagram') || {
      visualizations: 307200,
      newFollowers: 6300,
      sharedContent: 357,
    };
  }, [socialMetrics]);

  // Dados dos KPIs
  const kpiTargets = useMemo(() => ({
    visualizacoes: instagramData.visualizations || 307200,
    novosSeguidor: instagramData.newFollowers || 6300,
    conteudoCompartilhado: instagramData.sharedContent || 357,
    vagasAtivas: stats?.totalVagas || 0,
    vagasHomeOffice: stats?.vagasRemoto || 0,
    acessosSite: 1250,
  }), [instagramData, stats]);

  // Animar contadores quando os dados mudarem
  useEffect(() => {
    const animationDuration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      setDisplayedStats({
        visualizacoes: Math.floor(kpiTargets.visualizacoes * progress),
        novosSeguidor: Math.floor(kpiTargets.novosSeguidor * progress),
        conteudoCompartilhado: Math.floor(kpiTargets.conteudoCompartilhado * progress),
        vagasAtivas: Math.floor(kpiTargets.vagasAtivas * progress),
        vagasHomeOffice: Math.floor(kpiTargets.vagasHomeOffice * progress),
        acessosSite: Math.floor(kpiTargets.acessosSite * progress),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [kpiTargets.visualizacoes, kpiTargets.novosSeguidor, kpiTargets.conteudoCompartilhado, kpiTargets.vagasAtivas, kpiTargets.vagasHomeOffice, kpiTargets.acessosSite]);

  const actions = [
    {
      icon: Briefcase,
      title: 'Divulgar uma Vaga',
      description: 'Publique sua oportunidade de emprego para alcançar os melhores talentos',
      href: '/sell-job-plans',
    },
    {
      icon: Users,
      title: 'Divulgar Mentoria',
      description: 'Compartilhe sua experiência e mentorize profissionais em desenvolvimento',
      href: '/sell-mentorship-plans',
    },
    {
      icon: BookOpen,
      title: 'Divulgar um Curso',
      description: 'Ofereça seu conhecimento através de cursos profissionais e especializados',
      href: '/sell-course-plans',
    },
    {
      icon: FileText,
      title: 'Fazer Meu Currículo',
      description: 'Crie um currículo profissional e destaque-se no mercado de trabalho',
      href: '/sell-resume-services',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 text-white py-20 md:py-32 px-4 overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Bem-vindo à <span className="text-green-400">ClaunNetworking</span>
            </h1>
            <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Seu hub de carreira para crescer, divulgar e conquistar oportunidades
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/home')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar Oportunidades
              </Button>
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate('/company-dashboard')}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  <User className="w-5 h-5 mr-2" />
                  Acessar Minha Conta
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-700 px-8 py-3 rounded-lg font-semibold text-lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Fazer Login
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* KPIs Section */}
        <section className="bg-white px-4 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 divide-x divide-y md:divide-y-0">
                {/* KPI 1 - Visualizações Instagram */}
                <div className="text-center p-8 md:p-10">
                  <p className="text-gray-700 text-sm font-medium mb-3">Visualizações</p>
                  <p className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                    {formatNumber(displayedStats.visualizacoes)}
                  </p>
                  <p className="text-gray-600 text-xs">Instagram</p>
                </div>

                {/* KPI 2 - Novos Seguidores Instagram */}
                <div className="text-center p-8 md:p-10">
                  <p className="text-gray-700 text-sm font-medium mb-3">Novos Seguidores</p>
                  <p className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                    +{formatNumber(displayedStats.novosSeguidor)}
                  </p>
                  <p className="text-gray-600 text-xs">Crescimento</p>
                </div>

                {/* KPI 3 - Conteúdo Compartilhado Instagram */}
                <div className="text-center p-8 md:p-10">
                  <p className="text-gray-700 text-sm font-medium mb-3">Conteúdo Compartilhado</p>
                  <p className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                    +{formatNumber(displayedStats.conteudoCompartilhado)}
                  </p>
                  <p className="text-gray-600 text-xs">Postagens</p>
                </div>

                {/* KPI 4 - Vagas Ativas */}
                <div className="text-center p-8 md:p-10">
                  <p className="text-gray-700 text-sm font-medium mb-3">Vagas Ativas</p>
                  <p className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                    {formatNumber(displayedStats.vagasAtivas)}
                  </p>
                  <p className="text-gray-600 text-xs">Oportunidades</p>
                </div>

                {/* KPI 5 - Vagas Home Office */}
                <div className="text-center p-8 md:p-10">
                  <p className="text-gray-700 text-sm font-medium mb-3">Vagas Home Office</p>
                  <p className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                    {formatNumber(displayedStats.vagasHomeOffice)}
                  </p>
                  <p className="text-gray-600 text-xs">Trabalho Remoto</p>
                </div>

                {/* KPI 6 - Acessos ao Site */}
                <div className="text-center p-8 md:p-10">
                  <p className="text-gray-700 text-sm font-medium mb-3">Acessos ao Site</p>
                  <p className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                    +{formatNumber(displayedStats.acessosSite)}
                  </p>
                  <p className="text-gray-600 text-xs">Visitantes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
              Como podemos te ajudar?
            </h2>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.href}
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Icon className="w-6 h-6 text-green-600" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {action.description}
                    </p>
                    <Button
                      onClick={() => navigate(action.href)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                    >
                      Saiba Mais
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
