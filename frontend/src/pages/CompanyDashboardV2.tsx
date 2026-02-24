import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Copy, Check, AlertCircle, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import { useState } from "react";

/**
 * CompanyDashboard V2
 * 
 * Dashboard para empresas gerenciarem suas vagas com/sem link externo.
 * 
 * Fluxo:
 * 1. Empresa visualiza vagas com status (Pendente, Aprovado, Rejeitado)
 * 2. Para vagas aprovadas, mostra link compartilhável
 * 3. Botão para criar nova vaga
 * 4. Integração com tRPC serviceRequests
 */

export default function CompanyDashboardV2() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Buscar vagas da empresa
  const { data: requests, isLoading, error } = trpc.serviceRequests.getByCompany.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const handleCopyLink = (sharedLink: string) => {
    const url = `${window.location.origin}/job/${sharedLink}`;
    navigator.clipboard.writeText(url);
    setCopiedId(sharedLink);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pendente
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Aprovado
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejeitado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Meu Dashboard</h1>
            <p className="text-gray-600 mt-2">Gerencie suas vagas e acompanhe o status</p>
          </div>
          <Button
            onClick={() => navigate("/company-post-job")}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Vaga
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Carregando vagas...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p>Erro ao carregar vagas: {error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!requests || requests.length === 0) && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Você ainda não publicou nenhuma vaga.</p>
                <Button
                  onClick={() => navigate("/company-post-job")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Publicar Primeira Vaga
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vagas List */}
        {!isLoading && !error && requests && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((request: any) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Detalhes da Vaga */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tipo</p>
                        <p className="font-medium">
                          {request.requestType === "public_link" ? "Com Link Externo" : "Sem Link Externo"}
                        </p>
                      </div>

                      {request.requestType === "public_link" && request.externalLink && (
                        <div>
                          <p className="text-sm text-gray-600">Link Externo</p>
                          <a
                            href={request.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                          >
                            {request.externalLink}
                          </a>
                        </div>
                      )}

                      {request.requestType === "full_form" && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600">Como Receber Candidaturas</p>
                            <p className="font-medium capitalize">{request.applicationType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Contato</p>
                            <p className="font-medium">{request.applicationRedirect}</p>
                          </div>
                        </>
                      )}

                      {request.city && (
                        <div>
                          <p className="text-sm text-gray-600">Localização</p>
                          <p className="font-medium">
                            {request.city}, {request.state}
                          </p>
                        </div>
                      )}

                      {request.modality && (
                        <div>
                          <p className="text-sm text-gray-600">Modalidade</p>
                          <p className="font-medium capitalize">{request.modality}</p>
                        </div>
                      )}
                    </div>

                    {/* Link Compartilhável */}
                    {request.status === "approved" && request.sharedLink && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-2">Link Compartilhável</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={`${window.location.origin}/job/${request.sharedLink}`}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyLink(request.sharedLink)}
                            className="flex items-center gap-2"
                          >
                            {copiedId === request.sharedLink ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copiar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Motivo de Rejeição */}
                    {request.status === "rejected" && request.rejectionReason && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-600 mb-2">Motivo da Rejeição</p>
                        <p className="text-red-800">{request.rejectionReason}</p>
                      </div>
                    )}

                    {/* Estatísticas */}
                    {request.status === "approved" && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{request.totalClicks || 0}</p>
                          <p className="text-xs text-gray-600">Cliques</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{request.totalViews || 0}</p>
                          <p className="text-xs text-gray-600">Visualizações</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{request.totalApplications || 0}</p>
                          <p className="text-xs text-gray-600">Candidaturas</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
