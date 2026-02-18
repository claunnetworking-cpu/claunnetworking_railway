import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import Pagination from '@/components/Pagination';
import { Search, X, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const ITEMS_PER_PAGE = 10;

export default function Courses() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('todos');
  const [isFree, setIsFree] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Aplicar filtros de query params ao carregar
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const modality = params.get('modality');
    const free = params.get('isFree');
    
    if (modality) {
      setSelectedModality(modality);
    }
    if (free === 'true') {
      setIsFree(true);
    }
  }, [location]);

  // Buscar cursos reais do banco
  const { data: allCourses = [], isLoading } = trpc.courses.list.useQuery();

  const filteredCursos = useMemo(() => {
    return allCourses.filter((curso) => {
      const matchesSearch =
        curso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.institution.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModality =
        selectedModality === 'todos' || curso.modality === selectedModality.charAt(0).toUpperCase() + selectedModality.slice(1);

      const matchesFree = !isFree || curso.isFree;

      return matchesSearch && matchesModality && matchesFree;
    });
  }, [searchTerm, selectedModality, isFree, allCourses]);

  const modalities: string[] = ['todos', 'online', 'presencial', 'híbrido'];

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedModality('todos');
    setIsFree(false);
    setCurrentPage(1);
  };

  // Calcular paginação
  const totalPages = Math.ceil(filteredCursos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCursos = filteredCursos.slice(startIndex, endIndex);

  // Reset para página 1 quando filtros mudam
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedModality]);

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cursos Disponíveis</h1>
            <p className="text-white/80">{allCourses.length} cursos disponíveis</p>
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
                  placeholder="Buscar por curso, instituição ou descrição..."
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

              {/* Clear Filters */}
              {(searchTerm || selectedModality !== 'todos') && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <X size={16} />
                  Limpar Filtros
                </button>
              )}
            </div>

            {/* Results Count */}
            <p className="text-white/80 text-sm mt-4">
              Mostrando {filteredCursos.length} cursos
            </p>
          </div>
        </section>

        {/* Courses List */}
        <section className="bg-primary px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin w-8 h-8 text-white" />
              </div>
            ) : filteredCursos.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedCursos.map((curso) => (
                    <JobCard 
                      key={curso.id} 
                      item={{ 
                        id: curso.id, 
                        titulo: curso.title, 
                        instituicao: curso.institution, 
                        horas: 0, 
                        modalidade: curso.modality.toLowerCase() as any, 
                        descricao: curso.description || '', 
                        link: curso.link, 
                        dataCadastro: new Date(curso.createdAt).toLocaleDateString('pt-BR') 
                      }} 
                      type="course" 
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalItems={filteredCursos.length}
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center">
                <p className="text-gray-600 text-lg">
                  Nenhum curso encontrado com os filtros selecionados.
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
