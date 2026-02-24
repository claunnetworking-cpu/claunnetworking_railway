import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Plus, Edit, Trash2, ChevronLeft, Zap, Eye, EyeOff, Upload } from 'lucide-react';
import { AdminPagination } from '@/components/AdminPagination';
import { BulkImportDialog } from '@/components/BulkImportDialog';
import { ResponsiveTable } from '@/components/ResponsiveTable';

const COURSES_PER_PAGE = 10;

export default function AdminCourses() {
  const [, setLocation] = useLocation();
  const [courses, setCourses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    institution: string;
    link: string;
    modality: 'Online' | 'Presencial' | 'Híbrido';
    isFree: boolean;
    category: 'atendimento' | 'assistente' | 'gestao' | 'saude' | 'telemarketing' | 'vendas' | 'operacional' | 'tecnologia' | 'marketing' | 'financas' | 'administrativo' | 'comercial' | 'direito' | 'educacao' | 'recursos_humanos' | 'logistica' | 'construcao' | 'saude_mental';
  }>({
    title: '',
    institution: '',
    link: '',
    modality: 'Online',
    isFree: true,
    category: 'educacao',
  });
  const [inactivatingId, setInactivatingId] = useState<string | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Paginação
  const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const paginatedCourses = courses.slice(startIndex, endIndex);

  const coursesQuery = trpc.courses.list.useQuery();
  const createMutation = trpc.courses.create.useMutation();
  const updateMutation = trpc.courses.update.useMutation();
  const deleteMutation = trpc.courses.delete.useMutation();

  useEffect(() => {
    if (coursesQuery.data) {
      setCourses(coursesQuery.data);
    }
  }, [coursesQuery.data]);

  const handleEdit = (course: any) => {
    setEditingId(course.id);
    setFormData({
      title: course.title,
      institution: course.institution,
      link: course.link,
      modality: course.modality as 'Online' | 'Presencial' | 'Híbrido',
      isFree: course.isFree,
      category: (course.category || 'educacao') as 'atendimento' | 'assistente' | 'gestao' | 'saude' | 'telemarketing' | 'vendas' | 'operacional' | 'tecnologia' | 'marketing' | 'financas' | 'administrativo' | 'comercial' | 'direito' | 'educacao' | 'recursos_humanos' | 'logistica' | 'construcao' | 'saude_mental',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este curso?')) {
      await deleteMutation.mutateAsync({ id });
      coursesQuery.refetch();
    }
  };

  const handleToggleActive = async (id: string) => {
    setInactivatingId(id);
    try {
      const course = courses.find((c) => c.id === id);
      if (course) {
        const newStatus = course.status === 'ativo' ? 'inativo' : 'ativo';
        await updateMutation.mutateAsync({ id, status: newStatus });
        coursesQuery.refetch();
      }
    } finally {
      setInactivatingId(null);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'inactivate' | 'delete') => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      alert('Selecione pelo menos um curso');
      return;
    }

    if (action === 'delete' && !confirm(`Deseja remover ${ids.length} curso(s)?`)) {
      return;
    }

    try {
      if (action === 'delete') {
        for (const id of ids) {
          await deleteMutation.mutateAsync({ id });
        }
      } else {
        const newStatus = action === 'activate' ? 'ativo' : 'inativo';
        for (const id of ids) {
          await updateMutation.mutateAsync({ id, status: newStatus });
        }
      }
      setSelectedIds(new Set());
      coursesQuery.refetch();
    } catch (error) {
      console.error('Erro na ação em lote:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        institution: '',
        link: '',
        modality: 'Online' as const,
        isFree: true,
        category: 'educacao',
      });
      coursesQuery.refetch();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === courses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(courses.map((c) => c.id)));
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Cadastro de Cursos</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Curso
          </button>
          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Importar em Lote
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Curso' : 'Adicionar Novo Curso'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  placeholder="Título do Curso"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Instituição</label>
                <input
                  type="text"
                  placeholder="Nome da Instituição"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Link do Curso</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/curso"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Modalidade</label>
                  <select
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option>Online</option>
                    <option>Presencial</option>
                    <option>Híbrido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">Curso Gratuito</span>
              </label>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {editingId ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {coursesQuery.isLoading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <>
            <ResponsiveTable
              headers={['ID', 'Título', 'Instituição', 'Modalidade']}
              rows={paginatedCourses.map((course) => ({
                id: course.id,
                cells: [
                  <span className="font-mono text-xs">{course.id.slice(0, 8)}</span>,
                  <span className="font-medium">{course.title}</span>,
                  <span>{course.institution || '-'}</span>,
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {course.modality}
                  </span>,
                ],
                actions: (
                  <>
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar curso"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(course.id)}
                      disabled={inactivatingId === course.id}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                      title={course.status === 'ativo' ? 'Inativar curso' : 'Ativar curso'}
                    >
                      {course.status === 'ativo' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover curso"
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

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <BulkImportDialog
          open={showBulkImport}
          onOpenChange={setShowBulkImport}
          type="courses"
          onSuccess={() => {
            setShowBulkImport(false);
            coursesQuery.refetch();
          }}
        />
      </div>
    </div>
  );
}
