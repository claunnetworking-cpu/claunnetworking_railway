import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function CompanyPostJob() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkValid, setLinkValid] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    link: '',
    city: '',
    state: '',
    modality: 'Presencial' as const,
    isPCD: false,
    category: 'tecnologia',
  });

  const createJobMutation = trpc.jobs.create.useMutation();
  const checkDuplicateQuery = trpc.jobs.checkDuplicate.useQuery(
    { link: formData.link },
    { enabled: formData.link.length > 0 }
  );

  useEffect(() => {
    if (formData.link && checkDuplicateQuery.data) {
      if (checkDuplicateQuery.data.isDuplicate) {
        setLinkError(checkDuplicateQuery.data.message || 'Link já cadastrado');
        setLinkValid(false);
      } else {
        setLinkError(null);
        setLinkValid(true);
      }
    } else if (!formData.link) {
      setLinkError(null);
      setLinkValid(false);
    }
  }, [checkDuplicateQuery.data, formData.link]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Por favor, preencha o título da vaga');
      return;
    }
    
    if (!formData.company.trim()) {
      toast.error('Por favor, preencha o nome da empresa');
      return;
    }
    
    if (!formData.link.trim()) {
      toast.error('Por favor, preencha o link da vaga');
      return;
    }

    if (linkError) {
      toast.error(linkError);
      return;
    }

    setIsSubmitting(true);
    try {
      await createJobMutation.mutateAsync({
        title: formData.title,
        company: formData.company,
        description: formData.description,
        link: formData.link,
        city: formData.city,
        state: formData.state,
        modality: formData.modality,
        isPCD: formData.isPCD,
        category: formData.category as any,
      });
      
      toast.success('Vaga publicada com sucesso!');
      
      // Limpar formulário
      setFormData({
        title: '',
        company: '',
        description: '',
        link: '',
        city: '',
        state: '',
        modality: 'Presencial',
        isPCD: false,
        category: 'tecnologia',
      });
      
      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        setLocation('/company-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erro ao publicar vaga:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao publicar vaga');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation('/company-dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-900" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Publicar Vaga</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título da Vaga *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Desenvolvedor Full Stack"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800"
              />
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome da Empresa *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Ex: Tech Solutions Inc"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição da Vaga
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva os requisitos, responsabilidades e benefícios da vaga..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Link da Vaga *
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://exemplo.com/vagas/123"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none text-gray-800 ${
                    linkError ? 'border-red-500 focus:border-red-500' : 
                    linkValid ? 'border-green-500 focus:border-green-500' :
                    'border-gray-300 focus:border-purple-500'
                  }`}
                />
                {linkValid && (
                  <CheckCircle2 className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
                )}
                {linkError && (
                  <AlertCircle className="absolute right-3 top-3.5 h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Cole o link da página de candidatura</p>
              {linkError && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {linkError}
                </p>
              )}
              {linkValid && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Link válido e disponível
                </p>
              )}
            </div>

            {/* Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ex: São Paulo"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 bg-white"
                >
                  <option value="">Selecionar Estado</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="BA">Bahia</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="GO">Goiás</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                </select>
              </div>
            </div>

            {/* Modalidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Modalidade
                </label>
                <select
                  value={formData.modality}
                  onChange={(e) => setFormData({ ...formData, modality: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 bg-white"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 bg-white"
                >
                  <option value="tecnologia">Tecnologia</option>
                  <option value="vendas">Vendas</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="gestao">Gestão</option>
                  <option value="marketing">Marketing</option>
                  <option value="financas">Finanças</option>
                  <option value="recursos_humanos">Recursos Humanos</option>
                  <option value="operacional">Operacional</option>
                </select>
              </div>
            </div>

            {/* PCD */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPCD"
                checked={formData.isPCD}
                onChange={(e) => setFormData({ ...formData, isPCD: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="isPCD" className="text-sm font-semibold text-gray-700">
                Vaga para Pessoas com Deficiência (PCD)
              </label>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Informações Importantes</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Verifique se o link está correto e acessível</li>
                  <li>Sua vaga será publicada imediatamente</li>
                  <li>Você pode editar ou remover a vaga a qualquer momento</li>
                </ul>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/company-dashboard')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !!linkError}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar Vaga'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
