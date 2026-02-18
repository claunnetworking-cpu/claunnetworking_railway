import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Plus, Copy, Check, Trash2, ChevronLeft, Link as LinkIcon, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLinks() {
  const [, setLocation] = useLocation();
  const [links, setLinks] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'job' | 'course'>('job');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    originalUrl: '',
    alias: '',
  });

  const { data: linksData } = trpc.links.list.useQuery();
  const { data: jobsData } = trpc.jobs.list.useQuery();
  const { data: coursesData } = trpc.courses.list.useQuery();
  const createLinkMutation = trpc.links.create.useMutation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/login');
    }
  }, [setLocation]);

  useEffect(() => {
    if (linksData) {
      setLinks(linksData);
    }
  }, [linksData]);

  useEffect(() => {
    if (jobsData) {
      setJobs(jobsData);
    }
  }, [jobsData]);

  useEffect(() => {
    if (coursesData) {
      setCourses(coursesData);
    }
  }, [coursesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedItem = selectedType === 'job' 
        ? jobs.find(j => j.id === selectedItemId)
        : courses.find(c => c.id === selectedItemId);

      if (!selectedItem) {
        toast.error('Selecione uma vaga ou curso');
        return;
      }

      await createLinkMutation.mutateAsync({
        originalUrl: selectedItem.link,
        alias: formData.alias || `${selectedType}-${selectedItem.id.slice(0, 8)}`,
      });
      setFormData({ originalUrl: '', alias: '' });
      setShowForm(false);
      setSelectedItemId('');
      toast.success('Link criado com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao criar link:', error);
      toast.error('Erro ao criar link');
    }
  };

  const handleCopyLink = (shortCode: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${baseUrl}/l/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(shortCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (link: any) => {
    setEditingId(link.id);
    setFormData({ originalUrl: link.originalUrl, alias: link.alias });
    setShowForm(true);
  };

  const handleDelete = (linkId: string) => {
    if (confirm('Tem certeza que deseja remover este link?')) {
      toast.success('Link removido com sucesso!');
      window.location.reload();
    }
  };



  const getItemName = (link: any) => {
    const job = jobs.find(j => j.link === link.originalUrl);
    const course = courses.find(c => c.link === link.originalUrl);
    return job?.title || course?.title || 'Link personalizado';
  };

  const getItemType = (link: any) => {
    const job = jobs.find(j => j.link === link.originalUrl);
    return job ? 'Vaga' : 'Curso';
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gerador de Links</h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors text-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Link
        </button>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Criar Link Encurtado</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="job"
                      checked={selectedType === 'job'}
                      onChange={(e) => {
                        setSelectedType(e.target.value as 'job' | 'course');
                        setSelectedItemId('');
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Vaga</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="course"
                      checked={selectedType === 'course'}
                      onChange={(e) => {
                        setSelectedType(e.target.value as 'job' | 'course');
                        setSelectedItemId('');
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Curso</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedType === 'job' ? 'Selecione uma Vaga' : 'Selecione um Curso'}
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  required
                >
                  <option value="">Escolha uma opção...</option>
                  {selectedType === 'job' ? (
                    jobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </option>
                    ))
                  ) : (
                    courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title} - {course.institution}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apelido (opcional)
                </label>
                <input
                  type="text"
                  placeholder="ex: meu-link"
                  value={formData.alias}
                  onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Criar Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ originalUrl: '', alias: '' });
                    setSelectedItemId('');
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Apelido</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Associado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Cliques</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {links.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Nenhum link criado
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-gray-900 font-mono text-xs">{link.alias || '-'}</td>
                    <td className="px-4 py-4 text-gray-600">{getItemName(link)}</td>
                    <td className="px-4 py-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {getItemType(link)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-900 font-semibold">{link.clicks || 0}</td>
                    <td className="px-4 py-4 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleCopyLink(link.shortCode)}
                        className={`px-3 py-1 rounded transition-colors flex items-center gap-1 text-xs ${
                          copiedId === link.shortCode
                            ? 'bg-green-100 text-green-700'
                            : 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                        }`}
                      >
                        {copiedId === link.shortCode ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copiar
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(link)}
                        className="px-3 py-1 rounded transition-colors flex items-center gap-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        <Edit className="w-3 h-3" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="px-3 py-1 rounded transition-colors flex items-center gap-1 text-xs bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            💡 Como funciona
          </h3>
          <p className="text-blue-800 text-sm">
            Crie links encurtados para suas vagas e cursos para rastrear quantas vezes foram clicados. Cada clique é registrado automaticamente e pode ser visualizado nas métricas.
          </p>
        </div>
      </div>
    </div>
  );
}
