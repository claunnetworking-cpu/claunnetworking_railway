import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { AlertCircle, ArrowLeft, Mail, MessageCircle, Globe } from "lucide-react";
import { useEffect } from "react";

/**
 * MentorshipDetailPage
 * 
 * Exibe detalhes de uma mentoria via link compartilhável.
 * Candidatos acessam este link para ver informações e se inscrever.
 */

export default function MentorshipDetailPage() {
  const [match, params] = useRoute("/mentorship/:sharedLink");
  const [, navigate] = useLocation();
  const sharedLink = params?.sharedLink as string;

  // Buscar mentoria por link compartilhável
  const { data: mentorship, isLoading, error } = trpc.serviceRequests.getBySharedLink.useQuery(
    { sharedLink },
    { enabled: !!sharedLink }
  );

  // Rastrear clique
  const trackClickMutation = trpc.serviceRequests.trackClick.useMutation();

  useEffect(() => {
    if (mentorship && sharedLink) {
      trackClickMutation.mutate({ sharedLink });
    }
  }, [mentorship, sharedLink]);

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Carregando mentoria...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !mentorship) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800 mb-4">
                <AlertCircle className="w-5 h-5" />
                <p>Mentoria não encontrada</p>
              </div>
              <Button onClick={() => navigate("/")} className="w-full">
                Voltar à Página Inicial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (mentorship.requestType === "public_link" && mentorship.externalLink) {
      // Redirecionar para link externo
      window.open(mentorship.externalLink as string, "_blank");
    } else {
      // Redirecionar para formulário de inscrição
      if (mentorship.applicationType === "email") {
        window.location.href = `mailto:${mentorship.applicationRedirect as string}?subject=Interesse em Mentoria: ${mentorship.title}`;
      } else if (mentorship.applicationType === "whatsapp") {
        window.open(`https://wa.me/${mentorship.applicationRedirect as string}?text=Olá, tenho interesse na mentoria: ${mentorship.title}`, "_blank");
      } else if (mentorship.applicationType === "website") {
        window.open(mentorship.applicationRedirect as string, "_blank");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header com Voltar */}
        <div className="mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        {/* Card Principal */}
        <Card className="mb-6">
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="text-3xl">{mentorship.title}</CardTitle>
              <p className="text-gray-600">
                Mentor: <span className="font-semibold">{mentorship.companyId}</span>
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Descrição */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre a Mentoria</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{mentorship.description}</p>
            </div>

            {/* Datas */}
            {mentorship.startDate && mentorship.endDate && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Data de Início</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(mentorship.startDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Data de Fim</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(mentorship.endDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            )}

            {/* Tipo de Inscrição */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Como se Inscrever</h3>
              {mentorship.requestType === "public_link" ? (
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Globe className="w-5 h-5" />
                  <span>Acesse o link externo para se inscrever</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {mentorship.applicationType === "email" && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-5 h-5" />
                      <span>Email: <strong>{mentorship.applicationRedirect}</strong></span>
                    </div>
                  )}
                  {mentorship.applicationType === "whatsapp" && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp: <strong>{mentorship.applicationRedirect}</strong></span>
                    </div>
                  )}
                  {mentorship.applicationType === "website" && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-5 h-5" />
                      <span>Visite: <strong>{mentorship.applicationRedirect}</strong></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botão de Inscrição */}
            <Button
              onClick={handleApply}
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
            >
              {mentorship.requestType === "public_link" ? "Acessar Mentoria" : "Me Inscrever"}
            </Button>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600">Cliques</p>
                <p className="text-2xl font-bold text-gray-900">{mentorship.totalClicks || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900">{mentorship.totalViews || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
