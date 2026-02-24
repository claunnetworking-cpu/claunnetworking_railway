import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, ExternalLink, Mail, MessageCircle, Globe } from "lucide-react";
import { useState } from "react";

/**
 * JobDetailPage
 * 
 * Página para exibir detalhes de vaga via link compartilhável.
 * 
 * Fluxo:
 * 1. Candidato clica em link compartilhável (/job/:sharedLink)
 * 2. Busca detalhes da vaga via tRPC
 * 3. Se vaga tem link externo: mostra botão para redirecionar
 * 4. Se vaga sem link: mostra formulário de inscrição (email, WhatsApp, site)
 */

export default function JobDetailPage() {
  const [match, params] = useRoute("/job/:sharedLink");
  const [, navigate] = useLocation();
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const sharedLink = params?.sharedLink as string;

  // Buscar detalhes da vaga
  const { data: request, isLoading, error } = trpc.serviceRequests.getBySharedLink.useQuery(
    { sharedLink },
    { enabled: !!sharedLink }
  );

  if (!match) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Carregando detalhes da vaga...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800 mb-4">
              <AlertCircle className="w-5 h-5" />
              <p>Vaga não encontrada</p>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se vaga tem link externo, redirecionar
  if (request.requestType === "public_link" && request.externalLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{request.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{request.description}</p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Você será redirecionado para:</p>
              <p className="font-medium text-blue-600 break-all">{request.externalLink}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => window.open(request.externalLink as string, "_blank")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Acessar Vaga
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se vaga sem link, mostrar formulário de inscrição
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{request.title}</CardTitle>
                <p className="text-gray-600 mt-2">{request.description}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Detalhes da Vaga */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b">
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

              {request.level && (
                <div>
                  <p className="text-sm text-gray-600">Nível</p>
                  <p className="font-medium capitalize">{request.level}</p>
                </div>
              )}

              {request.salary && request.salaryVisible && (
                <div>
                  <p className="text-sm text-gray-600">Salário</p>
                  <p className="font-medium">R$ {parseFloat(request.salary).toLocaleString("pt-BR")}</p>
                </div>
              )}

              {request.benefits && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Benefícios</p>
                  <p className="font-medium">{request.benefits}</p>
                </div>
              )}
            </div>

            {/* Formulário de Inscrição */}
            {!submitted ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Se Inscrever</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={applicationData.name}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={applicationData.email}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    value={applicationData.message}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, message: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Conte-nos um pouco sobre você..."
                    rows={4}
                  />
                </div>

                {/* Botões de Inscrição */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                  <p className="text-sm text-gray-700">
                    Enviar inscrição por:
                  </p>

                  {request.applicationType === "email" && request.applicationRedirect && (
                    <Button
                      onClick={() => {
                        // Construir email
                        const subject = `Inscrição para: ${request.title}`;
                        const body = `Nome: ${applicationData.name}\nEmail: ${applicationData.email}\nTelefone: ${applicationData.phone}\n\nMensagem:\n${applicationData.message}`;
                        window.location.href = `mailto:${request.applicationRedirect}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        setSubmitted(true);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Enviar por Email
                    </Button>
                  )}

                  {request.applicationType === "whatsapp" && request.applicationRedirect && (
                    <Button
                      onClick={() => {
                        const message = `Olá! Tenho interesse na vaga: ${request.title}\n\nNome: ${applicationData.name}\nEmail: ${applicationData.email}\nTelefone: ${applicationData.phone}\n\nMensagem: ${applicationData.message}`;
                        const whatsappUrl = `https://wa.me/${(request.applicationRedirect as string).replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, "_blank");
                        setSubmitted(true);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enviar por WhatsApp
                    </Button>
                  )}

                  {request.applicationType === "website" && request.applicationRedirect && (
                    <Button
                      onClick={() => {
                        window.open(request.applicationRedirect as string, "_blank");
                        setSubmitted(true);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Acessar Site de Inscrição
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                <p className="text-green-800 font-medium mb-4">
                  ✓ Inscrição enviada com sucesso!
                </p>
                <p className="text-gray-600 mb-4">
                  A empresa receberá sua inscrição e entrará em contato em breve.
                </p>
                <Button onClick={() => navigate("/")} className="w-full">
                  Voltar à Página Inicial
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
