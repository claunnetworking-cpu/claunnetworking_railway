import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Plus, Edit, Trash2, ChevronLeft, Zap, Eye, EyeOff, Check, Upload, Download } from 'lucide-react';
import { AdminPagination } from '@/components/AdminPagination';
import { toast } from 'sonner';
import { BulkImportDialog } from '@/components/BulkImportDialog';
import { ResponsiveTable } from '@/components/ResponsiveTable';

const JOBS_PER_PAGE = 10;

export default function AdminJobs() {
  const [, setLocation] = useLocation();
  const [jobs, setJobs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [inactivatingId, setInactivatingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [categoryInput, setCategoryInput] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtro e Paginação
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  const [formData, setFormData] = useState<any>({
    title: '',
    company: '',
    link: '',
    city: '',
    state: '',
    modality: 'Presencial',
    isPCD: false,
    category: 'administrativo',
  });

  const { data: jobsData } = trpc.jobs.list.useQuery();
  const utils = trpc.useUtils();
  const createJobMutation = trpc.jobs.create.useMutation({
    onSuccess: () => {
      utils.jobs.list.invalidate();
    },
  });
  const updateJobMutation = trpc.jobs.update.useMutation({
    onSuccess: () => {
      utils.jobs.list.invalidate();
    },
  });
  const deleteJobMutation = trpc.jobs.delete.useMutation({
    onSuccess: () => {
      utils.jobs.list.invalidate();
    },
  });
  const extractJobMutation = trpc.extract.job.useMutation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/login');
    }
  }, [setLocation]);

  useEffect(() => {
    if (jobsData) {
      setJobs(jobsData);
      setCurrentPage(1);
      setSearchTerm('');
    }
  }, [jobsData]);

  const handleExtractFromLink = async () => {
    if (!formData.link) {
      alert('Por favor, insira um link');
      return;
    }
    
    setExtracting(true);
    try {
      const result = await extractJobMutation.mutateAsync({ url: formData.link });
      if (result.success && result.data) {
      setFormData((prev: any) => ({
        ...prev,
        title: result.data.title || prev.title,
        company: result.data.company || prev.company,
        city: result.data.city || prev.city,
        state: result.data.state || prev.state,
        modality: result.data.modality || prev.modality,
        isPCD: result.data.isPCD || prev.isPCD,
        category: result.data.category || prev.category,
      }));
        toast.success('Dados extraídos com sucesso!');
      } else {
        toast.error('Erro ao extrair dados: ' + (result.error || 'Tente novamente'));
      }
    } catch (error) {
      console.error('Erro na extração:', error);
      toast.error('Erro ao extrair dados do link');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        category: (categoryInput || formData.category).toLowerCase(),
      };

      if (editingId) {
        await updateJobMutation.mutateAsync({
          id: editingId,
          ...jobData,
        });
        toast.success('Vaga atualizada com sucesso!');
      } else {
        await createJobMutation.mutateAsync(jobData);
        toast.success('Vaga criada com sucesso!');
      }
      setFormData({
        title: '',
        company: '',
        link: '',
        city: '',
        state: '',
        modality: 'Presencial',
        isPCD: false,
        category: 'administrativo',
      });
      setShowForm(false);
      setEditingId(null);
      setCategoryInput('');
    } catch (error) {
      console.error('Erro ao salvar vaga:', error);
      toast.error('Erro ao salvar vaga');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta vaga?')) {
      try {
        await deleteJobMutation.mutateAsync({ id });
        toast.success('Vaga removida com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar vaga:', error);
        toast.error('Erro ao deletar vaga');
      }
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const action = currentStatus ? 'inativar' : 'ativar';
    if (confirm(`Tem certeza que deseja ${action} esta vaga?`)) {
      try {
        setInactivatingId(id);
        const jobToUpdate = jobs.find(j => j.id === id);
        await updateJobMutation.mutateAsync({
          id,
          ...jobToUpdate,
          isActive: !currentStatus,
        });
        toast.success(`Vaga ${action}ada com sucesso!`);
      } catch (error) {
        console.error(`Erro ao ${action} vaga:`, error);
        toast.error(`Erro ao ${action} vaga`);
      } finally {
        setInactivatingId(null);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error('Selecione pelo menos uma vaga');
      return;
    }
    if (confirm(`Tem certeza que deseja excluir ${selectedIds.size} vaga(s)?`)) {
      try {
        for (const id of Array.from(selectedIds)) {
          await deleteJobMutation.mutateAsync({ id });
        }
        toast.success(`${selectedIds.size} vaga(s) removida(s) com sucesso!`);
        setSelectedIds(new Set());
      } catch (error) {
        console.error('Erro ao deletar vagas:', error);
        toast.error('Erro ao deletar vagas');
      }
    }
  };

  const handleBulkToggleActive = async (newStatus: boolean) => {
    if (selectedIds.size === 0) {
      toast.error('Selecione pelo menos uma vaga');
      return;
    }
    const action = newStatus ? 'ativar' : 'inativar';
    if (confirm(`Tem certeza que deseja ${action} ${selectedIds.size} vaga(s)?`)) {
      try {
        for (const id of Array.from(selectedIds)) {
          const jobToUpdate = jobs.find(j => j.id === id);
          await updateJobMutation.mutateAsync({
            id,
            ...jobToUpdate,
            isActive: newStatus,
          });
        }
        toast.success(`${selectedIds.size} vaga(s) ${action}ada(s) com sucesso!`);
        setSelectedIds(new Set());
      } catch (error) {
        console.error(`Erro ao ${action} vagas:`, error);
        toast.error(`Erro ao ${action} vagas`);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === jobs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(jobs.map(j => j.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setLocation('/admin')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cadastro de Vagas</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Vaga
          </button>
          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Importar em Lote
          </button>
        </div>

        <BulkImportDialog
          open={showBulkImport}
          onOpenChange={setShowBulkImport}
          type="jobs"
          onSuccess={() => {
            setShowBulkImport(false);
          }}
        />

        {showForm && (
          <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Vaga' : 'Adicionar Nova Vaga'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Link Input */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link da Vaga
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/vaga"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleExtractFromLink}
                    disabled={extracting || !formData.link}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
                  >
                    <Zap className="w-4 h-4" />
                    {extracting ? 'Extraindo...' : 'Extrair'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    placeholder="Título da Vaga"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Empresa</label>
                  <input
                    type="text"
                    placeholder="Nome da Empresa"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Estado (UF)</label>
                  <input
                    type="text"
                    placeholder="Estado (UF)"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Modalidade</label>
                  <select
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      setCategoryInput(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="atendimento">Atendimento</option>
                    <option value="assistente">Assistente</option>
                    <option value="gestao">Gestão</option>
                    <option value="saude">Saúde</option>
                    <option value="telemarketing">Telemarketing</option>
                    <option value="vendas">Vendas</option>
                    <option value="operacional">Operacional</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="marketing">Marketing</option>
                    <option value="financas">Finanças</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="comercial">Comercial</option>
                    <option value="direito">Direito</option>
                    <option value="educacao">Educação</option>
                    <option value="recursos_humanos">Recursos Humanos</option>
                    <option value="logistica">Logística</option>
                    <option value="construcao">Construção</option>
                    <option value="saude_mental">Saúde Mental</option>
                    <option value="bancos">Bancos</option>
                    <option value="hospitais">Hospitais</option>
                    <option value="seguradoras">Seguradoras</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPCD}
                    onChange={(e) => setFormData({ ...formData, isPCD: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-sm">Vaga PCD</span>
                </label>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  {editingId ? 'Atualizar' : 'Salvar'} Vaga
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      title: '',
                      link: '',
                      city: '',
                      state: '',
                      modality: 'Presencial',
                      isPCD: false,
                      category: 'administrativo',
                    });
                    setCategoryInput('');
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Buscar por título ou empresa..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setCurrentPage(1);
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => setCurrentPage(1)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Buscar
            </button>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600">
              {filteredJobs.length} vaga(s) encontrada(s)
            </p>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              {selectedIds.size} vaga(s) selecionada(s)
            </span>
            <div className="flex flex-col md:flex-row gap-2">
              <button
                onClick={() => handleBulkToggleActive(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                Ativar
              </button>
              <button
                onClick={() => handleBulkToggleActive(false)}
                className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                <EyeOff className="w-4 h-4" />
                Inativar
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Remover
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <ResponsiveTable
          headers={['ID', 'Título', 'Empresa', 'Modalidade']}
          rows={paginatedJobs.map((job) => ({
            id: job.id,
            cells: [
              <span className="font-mono text-xs">{job.id.slice(0, 8)}</span>,
              <span className="font-medium">{job.title}</span>,
              <span>{job.company || '-'}</span>,
              <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-semibold">
                {job.modality}
              </span>,
            ],
            actions: (
              <>
                <button
                  onClick={() => {
                    const csvData = `Título,Empresa,Modalidade,Estado,Cidade,Link,PCD,Categoria\n${job.title},${job.company || ''},${job.modality},${job.state},${job.city},${job.link},${job.isPCD ? 'Sim' : 'Não'},${job.category}`;
                    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `${job.title.replace(/\s+/g, '_')}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Baixar vaga em CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingId(job.id);
                    setFormData(job);
                    setCategoryInput(job.category);
                    setShowForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar vaga"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(job.id, job.isActive)}
                  disabled={inactivatingId === job.id}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                  title={job.isActive ? 'Inativar vaga' : 'Ativar vaga'}
                >
                  {job.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remover vaga"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ),
          }))}
          showCheckbox={true}
          selectedIds={selectedIds}
          onSelect={toggleSelect}
          onSelectAll={toggleSelectAll}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
