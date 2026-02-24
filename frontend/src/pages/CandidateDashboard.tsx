import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Plus, LogOut, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function CandidateDashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const { data: resumes = [] } = trpc.serviceRequests.listByServiceType.useQuery(
    { serviceType: 'resume' },
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const handleLogout = async () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meu Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Bem-vindo, {user?.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Currículos Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Meus Currículos</h2>
              <p className="text-sm text-gray-600">Gerencie seus currículos compartilhados</p>
            </div>
            <Button
              onClick={() => setLocation('/candidate-post-resume')}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Enviar Novo Currículo
            </Button>
          </div>

          {resumes.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Você ainda não enviou nenhum currículo.</p>
                <Button
                  onClick={() => setLocation('/candidate-post-resume')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Enviar Currículo Agora
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {resumes.map((resume) => (
                <Card key={resume.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{resume.title}</CardTitle>
                        <CardDescription>
                          Enviado em {new Date(resume.createdAt).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          resume.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : resume.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {resume.status === 'pending' ? 'Pendente' : resume.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {resume.description}
                    </p>
                    <div className="flex gap-2">
                      {resume.metricsFileUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(resume.metricsFileUrl as string, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Arquivo
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/resume/${resume.sharedLink}`)}
                      >
                        Visualizar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Currículos Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{resumes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Aprovados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {resumes.filter(r => r.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {resumes.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
