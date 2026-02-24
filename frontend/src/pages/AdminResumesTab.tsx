import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Upload, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function AdminResumesTab() {
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [metricsFile, setMetricsFile] = useState<File | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: resumes = [] } = trpc.serviceRequests.listByServiceType.useQuery({
    serviceType: 'resume',
  });

  const approveMutation = trpc.serviceRequests.approve.useMutation();
  const rejectMutation = trpc.serviceRequests.reject.useMutation();
  const uploadMetricsMutation = trpc.serviceRequests.uploadMetrics.useMutation();

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync({ id });
      alert('Currículo aprovado com sucesso!');
      setSelectedResume(null);
    } catch (error) {
      alert('Erro ao aprovar currículo.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync({ id, reason: 'Rejeitado pelo admin' });
      alert('Currículo rejeitado.');
      setSelectedResume(null);
    } catch (error) {
      alert('Erro ao rejeitar currículo.');
    }
  };

  const handleUploadMetrics = async (id: string) => {
    if (!metricsFile) {
      alert('Por favor, selecione um arquivo.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        // TODO: Implementar upload de arquivo para S3
        // Por enquanto, vamos apenas atualizar o nome do arquivo
        await uploadMetricsMutation.mutateAsync({
          id,
          metricsFileUrl: base64,
          metricsFileName: metricsFile.name,
        });
        alert('Arquivo de métricas enviado com sucesso!');
        setMetricsFile(null);
      };
      reader.readAsDataURL(metricsFile);
    } catch (error) {
      alert('Erro ao enviar arquivo de métricas.');
    }
  };

  const filteredResumes = resumes.filter((resume) => {
    const matchesStatus = filterStatus === 'all' || resume.status === filterStatus;
    const matchesSearch = resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedResumeData = resumes.find(r => r.id === selectedResume);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Currículos</h2>
        <p className="text-sm text-gray-600 mt-1">Aprove ou rejeite currículos enviados por candidatos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Currículos */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Currículos</CardTitle>
              <CardDescription>Total: {filteredResumes.length}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros */}
              <div className="space-y-3">
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        filterStatus === status
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendentes' : status === 'approved' ? 'Aprovados' : 'Rejeitados'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredResumes.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Nenhum currículo encontrado</p>
                ) : (
                  filteredResumes.map((resume) => (
                    <button
                      key={resume.id}
                      onClick={() => setSelectedResume(resume.id)}
                      className={`w-full text-left p-3 rounded-lg border transition ${
                        selectedResume === resume.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{resume.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(resume.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                          resume.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : resume.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {resume.status === 'pending' ? 'Pendente' : resume.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Currículo Selecionado */}
        <div className="lg:col-span-2">
          {selectedResumeData ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedResumeData.title}</CardTitle>
                <CardDescription>
                  Enviado em {new Date(selectedResumeData.createdAt).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informações */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Informações do Candidato</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {selectedResumeData.applicationRedirect}</p>
                    <p><span className="font-medium">Status:</span> {selectedResumeData.status}</p>
                    <p><span className="font-medium">Período:</span> {selectedResumeData.startDate ? new Date(selectedResumeData.startDate).toLocaleDateString('pt-BR') : 'N/A'} até {selectedResumeData.endDate ? new Date(selectedResumeData.endDate).toLocaleDateString('pt-BR') : 'N/A'}</p>
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Resumo do Candidato</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 max-h-32 overflow-y-auto">
                    {selectedResumeData.description}
                  </div>
                </div>

                {/* Upload de Métricas */}
                {selectedResumeData.status === 'approved' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Arquivo de Métricas (Opcional)</h3>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          onChange={(e) => setMetricsFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="metrics-file"
                        />
                        <label htmlFor="metrics-file" className="cursor-pointer">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {metricsFile ? metricsFile.name : 'Clique para selecionar arquivo'}
                          </p>
                        </label>
                      </div>
                      {metricsFile && (
                        <Button
                          onClick={() => handleUploadMetrics(selectedResumeData.id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Enviar Arquivo
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedResumeData.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleApprove(selectedResumeData.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedResumeData.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                  {selectedResumeData.metricsFileUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedResumeData.metricsFileUrl as string, '_blank')}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Arquivo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Selecione um currículo para visualizar detalhes</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
