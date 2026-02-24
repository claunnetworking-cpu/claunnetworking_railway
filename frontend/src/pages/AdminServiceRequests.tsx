import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { CheckCircle, XCircle, AlertCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

/**
 * AdminServiceRequests
 * 
 * Painel para administrador aprovar/rejeitar pedidos de publicação de vagas, cursos, mentorias.
 * 
 * Fluxo:
 * 1. Admin vê lista de pedidos pendentes
 * 2. Clica em "Aprovar" para gerar link compartilhável
 * 3. Clica em "Rejeitar" para enviar motivo
 * 4. Link compartilhável aparece no dashboard da empresa
 */

export default function AdminServiceRequests() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Buscar pedidos pendentes
  const { data: requests, isLoading, error, refetch } = trpc.serviceRequests.listPending.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  // Mutation para aprovar
  const approveMutation = trpc.serviceRequests.approve.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Mutation para rejeitar
  const rejectMutation = trpc.serviceRequests.reject.useMutation({
    onSuccess: () => {
      setRejectingId(null);
      setRejectReason("");
      refetch();
    },
  });

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync({ id });
    } catch (err) {
      console.error("Erro ao aprovar:", err);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      alert("Por favor, forneça um motivo para a rejeição");
      return;
    }

    try {
      await rejectMutation.mutateAsync({ id, reason: rejectReason });
    } catch (err) {
      console.error("Erro ao rejeitar:", err);
    }
  };

  const handleCopyLink = (sharedLink: string) => {
    const url = `${window.location.origin}/job/${sharedLink}`;
    navigator.clipboard.writeText(url);
    setCopiedId(sharedLink);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getServiceTypeBadge = (serviceType: string) => {
    const colors: Record<string, string> = {
      job: "bg-blue-100 text-blue-800",
      course: "bg-green-100 text-green-800",
      mentorship: "bg-purple-100 text-purple-800",
      resume: "bg-orange-100 text-orange-800",
    };

    const labels: Record<string, string> = {
      job: "Vaga",
      course: "Curso",
      mentorship: "Mentoria",
      resume: "Currículo",
    };

    return (
      <Badge className={colors[serviceType] || "bg-gray-100 text-gray-800"}>
        {labels[serviceType] || serviceType}
      </Badge>
    );
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Você precisa ser administrador para acessar este painel.</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pedidos de Publicação</h1>
          <p className="text-gray-600 mt-2">Aprove ou rejeite pedidos de vagas, cursos e mentorias</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Carregando pedidos...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p>Erro ao carregar pedidos: {error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!requests || requests.length === 0) && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Não há pedidos pendentes no momento.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pedidos List */}
        {!isLoading && !error && requests && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((request: any) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        {getServiceTypeBadge(request.serviceType)}
                      </div>
                      <p className="text-sm text-gray-600">{request.description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Detalhes do Pedido */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                      <div>
                        <p className="text-sm text-gray-600">Empresa/Instituição</p>
                        <p className="font-medium">{request.companyId}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Tipo de Publicação</p>
                        <p className="font-medium">
                          {request.requestType === "public_link" ? "Com Link Externo" : "Sem Link Externo"}
                        </p>
                      </div>

                      {request.requestType === "public_link" && request.externalLink && (
                        <div className="md:col-span-2">
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
                            <p className="text-sm text-gray-600">Tipo de Inscrição</p>
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

                    {/* Link Encurtado */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link Encurtado (seu rastreamento)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={request.shortenedLink || ""}
                          placeholder="https://bit.ly/seu-link ou https://tinyurl.com/seu-link"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                          readOnly
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Cole aqui seu link encurtado para rastrear cliques reais
                      </p>
                    </div>

                    {/* Ações */}
                    {rejectingId === request.id ? (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200 space-y-3">
                        <p className="text-sm font-medium text-gray-700">Motivo da Rejeição</p>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Explique por que está rejeitando este pedido..."
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleReject(request.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            disabled={rejectMutation.isPending}
                          >
                            {rejectMutation.isPending ? "Rejeitando..." : "Confirmar Rejeição"}
                          </Button>
                          <Button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectReason("");
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4" />
                          {approveMutation.isPending ? "Aprovando..." : "Aprovar"}
                        </Button>
                        <Button
                          onClick={() => setRejectingId(request.id)}
                          variant="outline"
                          className="flex-1 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
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
