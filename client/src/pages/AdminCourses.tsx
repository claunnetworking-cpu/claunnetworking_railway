import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Plus, Edit, Trash2, ChevronLeft, Zap, Eye, EyeOff, Upload } from 'lucide-react';
import { BulkImportDialog } from '@/components/BulkImportDialog';

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
  }>({
    title: '',
    institution: '',
    link: '',
    modality: 'Online',
    isFree: true,
  });
  const [inactivatingId, setInactivatingId] = useState<string | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Cadastro de Cursos</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                title: '',
                institution: '',
                link: '',
                modality: 'Online' as const,
                isFree: true,
              });
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex-1 md:flex-none justify-center"
          >
            <Plus size={20} /> Novo Curso
          </button>
          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1 md:flex-none justify-center"
          >
            <Upload size={20} /> Importar em Lote
          </button>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="text-blue-900 font-medium">
            {selectedIds.size} curso(s) selecionado(s)
          </span>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => handleBulkAction('activate')}
              className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Ativar
            </button>
            <button
              onClick={() => handleBulkAction('inactivate')}
              className="flex-1 md:flex-none bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              Inativar
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="flex-1 md:flex-none bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border rounded-lg p-4 md:p-6 space-y-4">
          <h2 className="text-xl font-bold">
            {editingId ? 'Editar Curso' : 'Novo Curso'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Título do Curso"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border rounded-lg p-3 col-span-1 md:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Instituição"
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                className="border rounded-lg p-3 col-span-1 md:col-span-2"
                required
              />
              <div className="col-span-1 md:col-span-2 flex gap-2">
                <input
                  type="url"
                  placeholder="URL do Curso"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="border rounded-lg p-3 flex-1 w-full"
                  required
                />
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  Extrair
                </button>
              </div>
              <select
                value={formData.modality}
                onChange={(e) =>
                  setFormData({ ...formData, modality: e.target.value as any })
                }
                className="border rounded-lg p-3"
              >
                <option>Online</option>
                <option>Presencial</option>
                <option>Híbrido</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) =>
                    setFormData({ ...formData, isFree: e.target.checked })
                  }
                />
                <span>Curso Gratuito</span>
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === courses.length && courses.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Título</th>
                <th className="border p-3 text-left">Modalidade</th>
                <th className="border p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="border p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(course.id)}
                      onChange={() => toggleSelect(course.id)}
                    />
                  </td>
                  <td className="border p-3 text-sm">{course.id}</td>
                  <td className="border p-3">{course.title}</td>
                  <td className="border p-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {course.modality}
                    </span>
                  </td>
                  <td className="border p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar curso"
                      >
                        <Edit size={18} />
                      </button>
                  <button
                    onClick={() => handleToggleActive(course.id)}
                    disabled={inactivatingId === course.id}
                    className="text-yellow-600 hover:text-yellow-800"
                    title={course.status === 'ativo' ? 'Inativar curso' : 'Ativar curso'}
                  >
                    {course.status === 'ativo' ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Remover curso"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  );
}
