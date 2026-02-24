import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import Pagination from '@/components/Pagination';
import { Search, X, Loader2, Filter, ArrowUpDown } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const ITEMS_PER_PAGE = 10;

export default function Jobs() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'vagas' | 'cursos'>('vagas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('todas');
  const [selectedState, setSelectedState] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [pcdOnly, setPcdOnly] = useState(false);
  const [sortByDate, setSortByDate] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Sincronizar filtros com URL ao carregar a página
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modality = params.get('modality');
    const pcd = params.get('pcd');
    const category = params.get('category');
    const state = params.get('state');
    
    // Atualizar estado com valores da URL
    if (modality) {
      setSelectedModality(modality.toLowerCase().trim());
    } else {
      setSelectedModality('todas');
    }
    
    if (category) {
      setSelectedCategory(category.toLowerCase().trim());
    } else {
      setSelectedCategory('todas');
    }
    
    if (state) {
      setSelectedState(state.toUpperCase().trim());
    } else {
      setSelectedState('todos');
    }
    
    if (pcd === 'true') {
      setPcdOnly(true);
    } else {
      setPcdOnly(false);
    }
    
    setCurrentPage(1);
  }, [location]);

  // Buscar vagas e cursos reais do banco
  const { data: allJobs = [], isLoading: jobsLoading } = trpc.jobs.list.useQuery();
  const { data: allCourses = [], isLoading: coursesLoading } = trpc.courses.list.useQuery();

  const isLoading = jobsLoading || coursesLoading;

  // Filtrar e ordenar vagas
  const filteredVagas = useMemo(() => {
    const filtered = allJobs.filter((vaga) => {
      const matchesSearch =
        vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaga.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModality =
        selectedModality === 'todas' || (vaga.modality && vaga.modality.toLowerCase().trim() === selectedModality.toLowerCase().trim());

      const matchesState =
        selectedState === 'todos' || vaga.state === selectedState;

      const matchesCategory =
        selectedCategory === 'todas' || (vaga.category && vaga.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim());

      const matchesPcd = !pcdOnly || vaga.isPCD;

      return matchesSearch && matchesModality && matchesState && matchesCategory && matchesPcd;
    });

    // Ordenar por data
    return filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortByDate === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [searchTerm, selectedModality, selectedState, selectedCategory, pcdOnly, sortByDate, allJobs]);

  // Filtrar cursos
  const filteredCursos = useMemo(() => {
    const filtered = allCourses.filter((curso) => {
      const matchesSearch =
        curso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (curso.institution && curso.institution.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'todas' || (curso.category && curso.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });

    // Ordenar por data
    return filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortByDate === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [searchTerm, selectedCategory, sortByDate, allCourses]);

  const states = ['todos', ...Array.from(new Set(allJobs.map((v) => v.state || '').filter(Boolean)))];
  const modalities: string[] = ['todas', 'presencial', 'remoto', 'híbrido'];
  const categories = ['todas', ...Array.from(new Set([
    ...allJobs.map((v) => v.category || '').filter(Boolean),
    ...allCourses.map((c) => c.category || '').filter(Boolean)
  ]))];

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedModality('todas');
    setSelectedState('todos');
    setSelectedCategory('todas');
    setPcdOnly(false);
    setSortByDate('newest');
    setCurrentPage(1);
  };

  // Calcular paginação
  const currentData = activeTab === 'vagas' ? filteredVagas : filteredCursos;
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = currentData.slice(startIndex, endIndex);

  // Reset para página 1 quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedModality, selectedState, selectedCategory, pcdOnly, activeTab, sortByDate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-primary text-white py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/home')}
              className="mb-4 text-white/80 hover:text-white transition flex items-center gap-2"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {activeTab === 'vagas' ? 'Vagas de Emprego' : 'Cursos'}
            </h1>
            <p className="text-white/80">
              {activeTab === 'vagas' ? `${allJobs.length} vagas disponíveis` : `${allCourses.length} cursos disponíveis`}
            </p>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-primary px-4 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-4 border-b border-white/20">
              <button
                onClick={() => setActiveTab('vagas')}
                className={`pb-3 px-4 font-semibold transition-colors ${
                  activeTab === 'vagas'
                    ? 'text-white border-b-2 border-secondary'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Vagas ({allJobs.length})
              </button>
              <button
                onClick={() => setActiveTab('cursos')}
                className={`pb-3 px-4 font-semibold transition-colors ${
                  activeTab === 'cursos'
                    ? 'text-white border-b-2 border-secondary'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Cursos ({allCourses.length})
              </button>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-gray-50 px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Filters Card */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">Filtros de Busca</h2>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Busca Geral</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={activeTab === 'vagas' ? 'Título, instituição...' : 'Nome do curso...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none text-gray-800 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'todas' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modalidade (apenas para vagas) */}
                {activeTab === 'vagas' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Modalidade</label>
                    <select 
                      value={selectedModality}
                      onChange={(e) => setSelectedModality(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none text-gray-800 bg-white"
                    >
                      {modalities.map((mod) => (
                        <option key={mod} value={mod}>
                          {mod === 'todas' ? 'Todas' : mod.charAt(0).toUpperCase() + mod.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Estado (apenas para vagas) */}
                {activeTab === 'vagas' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                    <select 
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none text-gray-800 bg-white"
                    >
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state === 'todos' ? 'Todos' : state.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* PCD (apenas para vagas) */}
                {activeTab === 'vagas' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Acessibilidade</label>
                    <select 
                      value={pcdOnly ? 'pcd' : 'todas'}
                      onChange={(e) => setPcdOnly(e.target.value === 'pcd')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:outline-none text-gray-800 bg-white"
                    >
                      <option value="todas">Todas</option>
                      <option value="pcd">Apenas PCD</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Ordenação */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ordenar por</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortByDate('newest')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortByDate === 'newest'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowUpDown size={16} />
                    Mais Recentes
                  </button>
                  <button
                    onClick={() => setSortByDate('oldest')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      sortByDate === 'oldest'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowUpDown size={16} />
                    Mais Antigos
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleClearFilters}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X size={18} />
                  Limpar Filtros
                </button>
              </div>

              {/* Results Count */}
              <p className="text-gray-600 text-sm mt-4">
                Mostrando {paginatedData.length} de {currentData.length} {activeTab === 'vagas' ? 'vagas' : 'cursos'}
              </p>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
              </div>
            ) : paginatedData.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedData.map((item: any) => (
                    activeTab === 'vagas' ? (
                      <JobCard
                        key={item.id}
                        item={{
                          id: item.id,
                          titulo: item.title,
                          empresa: item.company,
                          estado: item.state || '',
                          modalidade: item.modality.toLowerCase() as any,
                          pcd: item.isPCD || false,
                          descricao: item.description || '',
                          link: item.link,
                          dataCadastro: item.createdAt
                        }}
                        type="job"
                      />
                    ) : (
                      <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 flex-1">{item.title}</h3>
                          {item.isFree && (
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                              Gratis
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.institution}</p>
                        {item.description && (
                          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{item.description}</p>
                        )}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          Acessar Curso
                        </a>
                      </div>
                    )
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Nenhum resultado encontrado</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
