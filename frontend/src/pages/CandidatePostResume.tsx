import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, ArrowLeft, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function CandidatePostResume() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    linkedinUrl: '',
    portfolioUrl: '',
    summary: '',
    experience: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = trpc.serviceRequests.create.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Você precisa estar logado para enviar seu currículo.</p>
            <Button onClick={() => setLocation('/')} className="w-full mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      alert('Por favor, selecione um arquivo de currículo.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        serviceType: 'resume',
        requestType: 'full_form',
        applicationType: 'email',
        title: `Currículo - ${formData.fullName}`,
        description: `${formData.summary}\n\nExperiência:\n${formData.experience}\n\nLinkedIn: ${formData.linkedinUrl}\nPortfólio: ${formData.portfolioUrl}`,
        applicationRedirect: formData.email,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });

      alert('Currículo enviado com sucesso! Você receberá uma resposta em breve.');
      setLocation('/candidate-dashboard');
    } catch (error) {
      console.error('Erro ao enviar currículo:', error);
      alert('Erro ao enviar currículo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation('/candidate-dashboard')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </button>

        <Card>
          <CardHeader>
            <CardTitle>Enviar Currículo</CardTitle>
            <CardDescription>
              Compartilhe seu currículo com nossos parceiros. Você pode atualizar a qualquer momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="Seu nome completo"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="seu@email.com"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do LinkedIn
                </label>
                <Input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
              </div>

              {/* Portfólio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Portfólio
                </label>
                <Input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://seu-portfolio.com"
                />
              </div>

              {/* Resumo Profissional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resumo Profissional
                </label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Descreva brevemente seu perfil profissional..."
                  rows={4}
                />
              </div>

              {/* Experiência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experiência Profissional
                </label>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Descreva sua experiência profissional..."
                  rows={4}
                />
              </div>

              {/* Upload de Arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arquivo de Currículo (PDF, DOC, DOCX) *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-file"
                  />
                  <label htmlFor="resume-file" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {resumeFile ? resumeFile.name : 'Clique para selecionar ou arraste um arquivo'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Máximo 5MB</p>
                  </label>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/candidate-dashboard')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !resumeFile}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Currículo'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
