import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, ChevronLeft, ChevronRight, Briefcase, Monitor, Users, Home as HomeIcon, Rocket, Accessibility, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const categoryLabels: Record<string, string> = {
  'atendimento': 'Atendimento',
  'assistente': 'Assistente',
  'gestao': 'Gestão',
  'saude': 'Saúde',
  'telemarketing': 'Telemarketing',
  'vendas': 'Vendas',
  'operacional': 'Operacional',
  'tecnologia': 'Tecnologia',
  'marketing': 'Marketing',
  'financas': 'Finanças',
  'administrativo': 'Administrativo',
  'comercial': 'Comercial',
  'direito': 'Direito',
  'educacao': 'Educação',
  'recursos_humanos': 'Recursos Humanos',
  'logistica': 'Logística',
  'construcao': 'Construção',
  'saude_mental': 'Saúde Mental',
};

const categoryIcons: Record<string, React.ReactNode> = {
  'atendimento': <Users className="w-5 h-5" />,
  'assistente': <Briefcase className="w-5 h-5" />,
  'gestao': <Briefcase className="w-5 h-5" />,
  'saude': <Briefcase className="w-5 h-5" />,
  'telemarketing': <Monitor className="w-5 h-5" />,
  'vendas': <Briefcase className="w-5 h-5" />,
  'operacional': <Briefcase className="w-5 h-5" />,
  'tecnologia': <Monitor className="w-5 h-5" />,
  'marketing': <Briefcase className="w-5 h-5" />,
  'financas': <Briefcase className="w-5 h-5" />,
  'administrativo': <Briefcase className="w-5 h-5" />,
  'comercial': <Briefcase className="w-5 h-5" />,
  'direito': <Briefcase className="w-5 h-5" />,
  'educacao': <Briefcase className="w-5 h-5" />,
  'recursos_humanos': <Users className="w-5 h-5" />,
  'logistica': <Briefcase className="w-5 h-5" />,
  'construcao': <Briefcase className="w-5 h-5" />,
  'saude_mental': <Briefcase className="w-5 h-5" />,
};

export default function Home() {
  const [, navigate] = useLocation();
  
  const handleStatisticClick = (filter: string, value?: string) => {
    const params = new URLSearchParams();
    if (filter === 'all') {
      navigate('/jobs');
    } else if (filter === 'remoto') {
      params.append('modality', 'remoto');
      navigate(`/jobs?${params.toString()}`);
    } else if (filter === 'pcd') {
      params.append('pcd', 'true');
      navigate(`/jobs?${params.toString()}`);
    }
  };
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('sessionId');
    if (stored) return stored;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', newId);
    return newId;
  });
  const CATEGORIES_PER_PAGE = 6;
  
  // Buscar estatísticas reais do banco
  const { data: stats, isLoading } = trpc.stats.getOverview.useQuery();
  const { data: jobsByCategory = [] } = trpc.stats.getJobsByCategory.useQuery();
  const { data: activeConnections = 0 } = trpc.stats.getActiveConnections.useQuery(
    undefined,
    { refetchInterval: 10000 }
  );
  const { data: topClickedJobs = [] } = trpc.stats.getTopClickedJobs.useQuery(
    undefined,
    { refetchInterval: 30000 }
  );
  const { data: socialMetrics = [] } = trpc.socialMedia.getAll.useQuery();

  const recordConnectionMutation = trpc.stats.recordConnection.useMutation();

  const estatisticas = stats || {
    totalVagas: 0,
    totalCursos: 0,
    vagasRemoto: 0,
    vagasPCD: 0,
    estadosCobertos: 0,
  };
  
  // Registrar conexão ao carregar
  useEffect(() => {
    recordConnectionMutation.mutate({
      sessionId,
      ipAddress: undefined,
      userAgent: navigator.userAgent,
    });
  }, [sessionId]);
  
  // Paginacao de categorias
  const totalCategoryPages = Math.ceil(jobsByCategory.length / CATEGORIES_PER_PAGE);
  const startIndex = (currentCategoryPage - 1) * CATEGORIES_PER_PAGE;
  const endIndex = startIndex + CATEGORIES_PER_PAGE;
  const paginatedCategories = jobsByCategory.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header />

      <main className="flex-1">

        {/* Botão de Voltar */}
        <section className="bg-primary px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-green-400 transition-colors font-semibold"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar para Início
            </button>
          </div>
        </section>

        {/* Estatísticas da Plataforma */}
        <section className="bg-primary px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
              <Briefcase className="w-6 h-6 md:w-8 md:h-8" />
              Estatísticas da Plataforma
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {/* Total de Vagas */}
              <button onClick={() => handleStatisticClick('all')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs md:text-sm font-semibold truncate">Total de Vagas</p>
                    <p className="text-2xl md:text-4xl font-bold text-green-600 mt-1 md:mt-2 break-words">{estatisticas.totalVagas}</p>
                  </div>
                  <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
                </div>
              </button>

              {/* Vagas Home Office */}
              <button onClick={() => handleStatisticClick('remoto')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer text-left hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs md:text-sm font-semibold truncate">Vagas Home Office</p>
                    <p className="text-2xl md:text-4xl font-bold text-green-600 mt-1 md:mt-2 break-words">{estatisticas.vagasRemoto}</p>
                  </div>
                  <HomeIcon className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
                </div>
              </button>

              {/* Vagas PCD */}
              <button onClick={() => handleStatisticClick('pcd')} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs md:text-sm font-semibold truncate">Vagas PCD</p>
                    <p className="text-2xl md:text-4xl font-bold text-green-600 mt-1 md:mt-2 break-words">{estatisticas.vagasPCD}</p>
                  </div>
                  <Accessibility className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Vagas por Categoria */}
        {jobsByCategory.length > 0 && (
          <section className="bg-primary px-4 py-12 md:py-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                Vagas por Categoria
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {paginatedCategories.map((item: any) => (
                  <button
                    key={item.category}
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.append('category', item.category);
                      navigate(`/jobs?${params.toString()}`);
                    }}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all text-center cursor-pointer hover:bg-gray-50"
                  >
                    <p className="text-2xl font-bold text-green-600 mb-1">{item.count}</p>
                    <p className="text-sm text-gray-700 font-medium">{categoryLabels[item.category] || item.category}</p>
                  </button>
                ))}
              </div>
              
              {totalCategoryPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => setCurrentCategoryPage(Math.max(1, currentCategoryPage - 1))}
                    disabled={currentCategoryPage === 1}
                    className="p-2 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalCategoryPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentCategoryPage(page)}
                        className={`px-3 py-1 rounded-lg transition-colors ${currentCategoryPage === page ? 'bg-white text-primary' : 'bg-white/20 text-white hover:bg-white/30'}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentCategoryPage(Math.min(totalCategoryPages, currentCategoryPage + 1))}
                    disabled={currentCategoryPage === totalCategoryPages}
                    className="p-2 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Cargos em Destaque - Top Clicked */}
        {topClickedJobs.length > 0 && (
          <section className="bg-primary px-4 py-8 md:py-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Briefcase className="w-8 h-8" />
                Cargos em Destaque
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topClickedJobs.map((job: any, index: number) => (
                  <div key={job.jobId} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">{job.jobTitle}</h3>
                    <div className="text-xs text-green-600 font-semibold">{job.clickCount} cliques</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Redes Sociais */}
        {socialMetrics.length > 0 && (
          <section className="bg-primary px-4 py-12 md:py-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                Acompanhe Nossas Redes Sociais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {socialMetrics.map((metric: any) => {
                  const platformIcons: Record<string, React.ReactNode> = {
                    instagram: <Instagram className="w-8 h-8 text-pink-600" />,
                    facebook: <Facebook className="w-8 h-8 text-blue-600" />,
                    linkedin: <Linkedin className="w-8 h-8 text-blue-700" />,
                    twitter: <Twitter className="w-8 h-8 text-blue-400" />,
                  };
                  const platformLabels: Record<string, string> = {
                    instagram: 'Instagram',
                    facebook: 'Facebook',
                    linkedin: 'LinkedIn',
                    twitter: 'Twitter',
                  };
                  return (
                    <div key={metric.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{platformLabels[metric.platform] || metric.platform}</h3>
                        {platformIcons[metric.platform]}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Visualizações</p>
                          <p className="text-2xl font-bold text-green-600">{(metric.visualizations / 1000).toFixed(1)}k</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Novos Seguidores</p>
                          <p className="text-2xl font-bold text-green-600">+{(metric.newFollowers / 1000).toFixed(1)}k</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Conteúdo Compartilhado</p>
                          <p className="text-2xl font-bold text-green-600">+{metric.sharedContent}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Explorar Oportunidades Button */}
        <section className="bg-primary px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto text-center">
            <button
              onClick={() => navigate('/jobs')}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              Explorar Oportunidades
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
