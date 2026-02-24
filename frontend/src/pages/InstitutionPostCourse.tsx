/**
 * ROTA PRIVADA - INSTITUICAO DE ENSINO
 * ====================================
 * Apenas instituicoes com plano ativo podem acessar esta rota
 * Esta rota eh DIFERENTE de /post-course (cursos publicos)
 * 
 * Funcionalidade: Cadastro de cursos PAGOS por instituicao educacional
 * Campos: nome, descricao, link, imagem, instagram, preco, duracao
 * Status: Recebido -> Em Analise -> Publicado -> Encerrado
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

export default function InstitutionPostCourse() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    link: '',
    imageUrl: '',
    instagram: '',
    price: '',
    duration: '',
    targetAudience: '',
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.courseName || !formData.description || !formData.link || !formData.price) {
      console.error('Preencha todos os campos obrigatórios');
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Integrar com tRPC para salvar curso no banco de dados
      // const result = await trpc.courses.create.useMutation({...formData});
      
      console.log('Curso cadastrado com sucesso! Status: Recebido');
      alert('Curso cadastrado com sucesso! Status: Recebido');

      // Redirecionar para dashboard da instituição
      setLocation('/institution-dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar curso. Tente novamente.');
      alert('Erro ao cadastrar curso. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation('/institution-dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Cadastrar Novo Curso</h1>
          <p className="text-slate-600 mt-2">Preencha os dados do seu curso educacional</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle>Informações do Curso</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome do Curso */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do Curso *
                </label>
                <Input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  placeholder="Ex: Python para Iniciantes"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição do Curso *
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o conteúdo, objetivos e público-alvo do curso"
                  rows={4}
                  required
                />
              </div>

              {/* Link de Inscrição */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Link de Inscrição *
                </label>
                <Input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://..."
                  required
                />
              </div>

              {/* Imagem do Curso */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL da Imagem do Curso
                </label>
                <Input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Instagram da Instituição
                </label>
                <Input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@seuinstagram"
                />
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preço (R$) *
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              {/* Duração */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duração do Curso
                </label>
                <Input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 4 semanas, 40 horas"
                />
              </div>

              {/* Público-Alvo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Público-Alvo
                </label>
                <Input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="Ex: Profissionais em transição de carreira"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="negocios">Negócios</option>
                  <option value="saude">Saúde</option>
                  <option value="educacao">Educação</option>
                  <option value="artes">Artes</option>
                  <option value="idiomas">Idiomas</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/institution-dashboard')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar Curso'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <strong>Status do Curso:</strong> Após o cadastro, seu curso entrará em status "Recebido" e será analisado por nossa equipe. Você receberá uma notificação quando o status mudar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
