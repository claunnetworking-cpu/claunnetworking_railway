import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Copy, Check } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

const jobFiltersBase = [
  { label: 'Todas as Vagas', path: '/jobs', query: '' },
  { label: 'Vagas PCD', path: '/jobs', query: '?pcd=true' },
];

const courseFiltersBase = [
  { label: 'Todos os Cursos', path: '/courses', query: '' },
  { label: 'Cursos Gratuitos', path: '/courses', query: '?isFree=true' },
];

export default function AdminFilters() {
  const [, setLocation] = useLocation();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'courses'>('jobs');
  const { data: jobsData } = trpc.jobs.list.useQuery();
  const { data: coursesData } = trpc.courses.list.useQuery();

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Gerar filtros dinâmicos por modalidade de vagas
  const jobModalityFilters = useMemo(() => {
    if (!jobsData) return [];
    const modalities = new Set(jobsData.map((job: any) => job.modality).filter(Boolean));
    return Array.from(modalities).map(modality => ({
      label: `Vagas ${modality}`,
      path: '/jobs',
      query: `?modality=${modality.toLowerCase()}`
    }));
  }, [jobsData]);

  // Gerar filtros dinâmicos por estado de vagas
  const jobStateFilters = useMemo(() => {
    if (!jobsData) return [];
    const states = new Set(jobsData.map((job: any) => job.state).filter(Boolean));
    return Array.from(states).map(state => ({
      label: `Vagas - ${state}`,
      path: '/jobs',
      query: `?state=${state}`
    }));
  }, [jobsData]);

  // Gerar filtros dinâmicos por modalidade de cursos
  const courseModalityFilters = useMemo(() => {
    if (!coursesData) return [];
    const modalities = new Set(coursesData.map((course: any) => course.modality).filter(Boolean));
    return Array.from(modalities).map(modality => ({
      label: `Cursos ${modality}`,
      path: '/courses',
      query: `?modality=${modality.toLowerCase()}`
    }));
  }, [coursesData]);

  // Gerar filtros dinâmicos por categoria de cursos
  const courseCategoryFilters = useMemo(() => {
    if (!coursesData) return [];
    const categories = new Set(coursesData.map((course: any) => course.category).filter(Boolean));
    return Array.from(categories).map(category => ({
      label: `Cursos - ${category}`,
      path: '/courses',
      query: `?category=${category}`
    }));
  }, [coursesData]);

  const jobFilters = [...jobFiltersBase, ...jobModalityFilters, ...jobStateFilters];
  const courseFilters = [...courseFiltersBase, ...courseModalityFilters, ...courseCategoryFilters];
  const filters = activeTab === 'jobs' ? jobFilters : courseFilters;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setLocation('/admin')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Filtros</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'jobs'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Filtros de Vagas
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'courses'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Filtros de Cursos
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filters.map((filter, index) => {
            const fullUrl = `${baseUrl}${filter.path}${filter.query}`;
            const isCopied = copiedUrl === fullUrl;

            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{filter.label}</h3>
                <div className="bg-gray-50 rounded-lg p-3 mb-4 break-all text-sm text-gray-600 font-mono">
                  {fullUrl}
                </div>
                <button
                  onClick={() => handleCopyUrl(fullUrl)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isCopied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-secondary text-white hover:bg-secondary/90'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar Link
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Como usar os filtros</h3>
          <p className="text-blue-800 mb-4">
            Os filtros abaixo são gerados automaticamente com base nas vagas e cursos cadastrados. Quando você adiciona uma nova vaga ou curso com uma modalidade ou estado diferente, um novo filtro é criado automaticamente.
          </p>
          <ul className="text-blue-800 space-y-2 list-disc list-inside">
            <li>Copie os links e compartilhe-os com seus usuários</li>
            <li>Os filtros são aplicados automaticamente quando o usuário acessa o link</li>
            <li>Novos filtros aparecem automaticamente quando você adiciona novos dados</li>
            <li>Use os links em emails, redes sociais ou mensagens</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
