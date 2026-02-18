import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatCard from '@/components/StatCard';
import { Briefcase, BookOpen, Monitor, Accessibility, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const categoryLabels: Record<string, string> = {
  'atendimento': 'Atendimento',
  'assistente': 'Assistente',
  'gestão': 'Gestão',
  'saúde': 'Saúde',
  'telemarketing': 'Telemarketing',
  'vendas': 'Vendas',
  'operacional': 'Operacional',
  'tecnologia': 'Tecnologia',
  'marketing': 'Marketing',
  'finanças': 'Finanças',
  'administrativo': 'Administrativo',
  'comercial': 'Comercial',
};

export default function Home() {
  const [, navigate] = useLocation();
  
  // Buscar estatísticas reais do banco
  const { data: stats, isLoading } = trpc.stats.getOverview.useQuery();
  const { data: jobsByCategory = [] } = trpc.stats.getJobsByCategory.useQuery();

  const estatisticas = stats || {
    totalVagas: 0,
    totalCursos: 0,
    vagasRemoto: 0,
    vagasPCD: 0,
    estadosCobertos: 0,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-white py-12 md:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Conecte-se às melhores oportunidades!
            </h1>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="bg-primary px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                  title="Total de Vagas"
                  value={estatisticas.totalVagas}
                  icon={<Briefcase />}
                  onClick={() => navigate('/jobs')}
                />
                <StatCard
                  title="Total de Cursos"
                  value={estatisticas.totalCursos}
                  icon={<BookOpen />}
                  onClick={() => navigate('/courses')}
                />
                <StatCard
                  title="Vagas Remoto"
                  value={estatisticas.vagasRemoto}
                  icon={<Monitor />}
                  subtitle="Clique para filtrar"
                  onClick={() => navigate('/jobs?modality=remoto')}
                />
                <StatCard
                  title="Vagas PCD"
                  value={estatisticas.vagasPCD}
                  icon={<Accessibility />}
                  subtitle="Clique para filtrar"
                  onClick={() => navigate('/jobs?pcd=true')}
                />
              </div>
            )}
          </div>
        </section>

        {/* Vagas por Categoria */}
        {jobsByCategory.length > 0 && (
          <section className="bg-gray-50 px-4 py-12 md:py-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Vagas por Categoria
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {jobsByCategory.map((item: any) => (
                  <button
                    key={item.category}
                    onClick={() => navigate(`/jobs?category=${encodeURIComponent(item.category)}`)}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg hover:bg-primary/5 transition-all text-center"
                  >
                    <p className="text-2xl font-bold text-primary mb-1">{item.count}</p>
                    <p className="text-sm text-gray-700 font-medium">{categoryLabels[item.category] || item.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
