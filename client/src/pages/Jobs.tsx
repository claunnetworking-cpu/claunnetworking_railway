import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import Pagination from '@/components/Pagination';
import { Search, X, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const ITEMS_PER_PAGE = 10;

export default function Jobs() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('todas');
  const [selectedState, setSelectedState] = useState<string>('todos');
  const [pcdOnly, setPcdOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Aplicar filtros de query params ao carregar
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const modality = params.get('modality');
    const pcd = params.get('pcd');
    
    if (modality) {
      setSelectedModality(modality);
    }
    if (pcd === 'true') {
      setPcdOnly(true);
    }
  }, [location]);

  // Buscar vagas reais do banco
  const { data: allJobs = [], isLoading } = trpc.jobs.list.useQuery();

  const filteredVagas = useMemo(() => {
    return allJobs.filter((vaga) => {
      const matchesSearch =
        vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaga.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModality =
        selectedModality === 'todas' || vaga.modality === selectedModality.charAt(0).toUpperCase() + selectedModality.slice(1);

      const matchesState =
        selectedState === 'todos' || vaga.state === selectedState;

      const matchesPcd = !pcdOnly || vaga.isPCD;

      return matchesSearch && matchesModality && matchesState && matchesPcd;
    });
  }, [searchTerm, selectedModality, selectedState, pcdOnly, allJobs]);

  const states = ['todos', ...Array.from(new Set(allJobs.map((v) => v.state || '').filter(Boolean)))];
  const modalities: string[] = ['todas', 'presencial', 'remoto', 'híbrido'];

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedModality('todas');
    setSelectedState('todos');
    setPcdOnly(false);
    setCurrentPage(1);
  };

  // Calcular paginação
  const totalPages = Math.ceil(filteredVagas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedVagas = filteredVagas.slice(startIndex, endIndex);

  // Reset para página 1 quando filtros mudam
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedModality, selectedState, pcdOnly]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-primary text-white py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/')}
              className="mb-4 text-white/80 hover:text-white transition flex items-center gap-2"
            >
              ← Voltar
            </button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Vagas de Emprego</h1>
            <p className="text-white/80">{allJobs.length} vagas disponíveis</p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-primary px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por cargo, empresa ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/30 focus:border-secondary focus:outline-none text-gray-800 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="space-y-4">
              {/* Modality */}
              <div>
                <p className="text-white text-sm font-semibold mb-2">Modalidade:</p>
                <div className="flex flex-wrap gap-2">
                  {modalities.map((modality) => (
                    <button
                      key={modality}
                      onClick={() => setSelectedModality(modality)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedModality === modality
                          ? 'bg-secondary text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {modality.charAt(0).toUpperCase() + modality.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <p className="text-white text-sm font-semibold mb-2">Estado:</p>
                <div className="flex flex-wrap gap-2">
                  {states.map((state) => (
                    <button
                      key={state}
                      onClick={() => setSelectedState(state)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedState === state
                          ? 'bg-secondary text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {state.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* PCD and Clear */}
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setPcdOnly(!pcdOnly)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    pcdOnly
                      ? 'bg-secondary text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {pcdOnly ? '✓ Apenas PCD' : 'Todas Vagas'}
                </button>

                {(searchTerm || selectedModality !== 'todas' || selectedState !== 'todos' || pcdOnly) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all flex items-center gap-2"
                  >
                    <X size={16} />
                    Limpar Filtros
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            <p className="text-white/80 text-sm mt-4">
              Mostrando {filteredVagas.length} vagas
            </p>
          </div>
        </section>

        {/* Jobs List */}
        <section className="bg-primary px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin w-8 h-8 text-white" />
              </div>
            ) : filteredVagas.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedVagas.map((vaga) => (
                    <JobCard key={vaga.id} item={{ id: vaga.id, titulo: vaga.title, empresa: vaga.company, estado: vaga.state || '', modalidade: vaga.modality.toLowerCase() as any, pcd: vaga.isPCD || false, descricao: vaga.description || '', link: vaga.link }} type="job" />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalItems={filteredVagas.length}
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center">
                <p className="text-gray-600 text-lg">
                  Nenhuma vaga encontrada com os filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
