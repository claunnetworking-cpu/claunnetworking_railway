import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertCircle, Copy, Download, Eye, Edit2, Plus, Calendar, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

/**
 * MentorDashboardV2
 * 
 * Dashboard para mentores gerenciarem suas mentorias.
 * Mesmo fluxo que CompanyDashboardV2 mas para mentorias.
 * 
 * Funcionalidades:
 * - Listagem de mentorias com status
 * - Link compartilhável para mentorias aprovadas
 * - Editar mentoria (antes de aprovação)
 * - Upload de métricas
 * - Visualizar estatísticas de cliques
 */

export default function MentorDashboardV2() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Buscar mentorias do mentor
  const { data: mentorships, isLoading, error, refetch } = trpc.serviceRequests.getByCompany.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Filtrar apenas mentorias
  const myMentorships = mentorships?.filter((m: any) => m.serviceType === "mentorship") || [];

  const handleCopyLink = (sharedLink: string) => {
    if (!sharedLink) return;
    const link = `${window.location.origin}/mentorship/${sharedLink}`;
    navigator.clipboard.writeText(link);
    setCopiedId(sharedLink);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Você precisa estar autenticado para acessar este painel.</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Mentorias</h1>
            <p className="text-gray-600 mt-2">Gerencie suas mentorias e acompanhe o desempenho</p>
          </div>
          <Button
            onClick={() => navigate("/mentor-post-mentorship")}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Postar Mentoria
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Carregando mentorias...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p>Erro ao carregar mentorias: {error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && myMentorships.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Você ainda não tem nenhuma mentoria postada.</p>
                <Button
                  onClick={() => navigate("/mentor-post-mentorship")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Postar Primeira Mentoria
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mentorias List */}
        {!isLoading && !error && myMentorships.length > 0 && (
          <div className="space-y-4">
            {myMentorships.map((mentorship: any) => (
              <Card key={mentorship.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Informações Básicas */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900">{mentorship.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{mentorship.description}</p>
                      <div className="flex gap-2 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          mentorship.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : mentorship.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {mentorship.status === "approved" ? "✓ Aprovado" : mentorship.status === "pending" ? "⏳ Pendente" : "✗ Rejeitado"}
                        </span>
                        {mentorship.startDate && mentorship.endDate && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(mentorship.startDate).toLocaleDateString()} - {new Date(mentorship.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600">Cliques</p>
                        <p className="text-2xl font-bold text-gray-900">{mentorship.totalClicks || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Visualizações</p>
                        <p className="text-2xl font-bold text-gray-900">{mentorship.totalViews || 0}</p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2">
                      {/* Link Compartilhável */}
                      {mentorship.status === "approved" && mentorship.sharedLink && (
                        <Button
                          onClick={() => handleCopyLink(mentorship.sharedLink)}
                          variant="outline"
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedId === mentorship.sharedLink ? "Copiado!" : "Copiar Link"}
                        </Button>
                      )}

                      {/* Editar (apenas pendentes) */}
                      {mentorship.status === "pending" && (
                        <Button
                          onClick={() => navigate(`/mentor-edit-mentorship/${mentorship.id}`)}
                          variant="outline"
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </Button>
                      )}

                      {/* Visualizar Detalhes */}
                      <Button
                        onClick={() => navigate(`/mentorship-details/${mentorship.id}`)}
                        variant="outline"
                        className="flex items-center gap-2"
                        size="sm"
                      >
                        <Eye className="w-4 h-4" />
                        Detalhes
                      </Button>

                      {/* Métricas */}
                      {mentorship.metricsFileUrl && (
                        <Button
                          onClick={() => window.open(mentorship.metricsFileUrl, "_blank")}
                          variant="outline"
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <Download className="w-4 h-4" />
                          Métricas
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {mentorship.status === "rejected" && mentorship.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-900">Motivo da Rejeição:</p>
                      <p className="text-sm text-red-800 mt-1">{mentorship.rejectionReason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Botão para Estatísticas */}
        {!isLoading && !error && myMentorships.length > 0 && (
          <div className="mt-8">
            <Button
              onClick={() => navigate("/mentor-statistics")}
              className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
            >
              Ver Estatísticas Completas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
