import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";

/**
 * InstitutionPostCourseV2
 * 
 * Formulário para instituições postarem cursos com escolha de tipo:
 * 1. COM LINK EXTERNO: Redireciona para URL externa
 * 2. SEM LINK EXTERNO: Formulário de inscrição integrado
 * 
 * Mesmo fluxo que CompanyPostJobV2 mas para cursos.
 */

export default function InstitutionPostCourseV2() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"type" | "form" | "success">("type");
  const [requestType, setRequestType] = useState<"public_link" | "full_form" | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    externalLink: "",
    city: "",
    state: "",
    modality: "online" as "presencial" | "online" | "hibrido",
    level: "iniciante" as "iniciante" | "intermediario" | "avancado",
    price: "",
    priceVisible: false,
    duration: "",
    applicationType: "email" as "email" | "whatsapp" | "website",
    applicationRedirect: "",
  });

  // Mutation para criar pedido
  const createMutation = trpc.serviceRequests.create.useMutation({
    onSuccess: () => {
      setStep("success");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestType) {
      alert("Selecione o tipo de curso");
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Título e descrição são obrigatórios");
      return;
    }

    if (requestType === "public_link" && !formData.externalLink.trim()) {
      alert("Link externo é obrigatório para cursos com link público");
      return;
    }

    if (requestType === "full_form" && !formData.applicationRedirect.trim()) {
      alert("Contato para inscrição é obrigatório");
      return;
    }

    try {
      await createMutation.mutateAsync({
        serviceType: "course",
        requestType,
        title: formData.title,
        description: formData.description,
        externalLink: requestType === "public_link" ? formData.externalLink : undefined,
        city: formData.city,
        state: formData.state,
        modality: formData.modality,
        level: formData.level,
        salary: formData.price ? parseFloat(formData.price) : undefined,
        salaryVisible: formData.priceVisible,
        benefits: formData.duration,
        applicationType: requestType === "full_form" ? formData.applicationType : "email",
        applicationRedirect: formData.applicationRedirect,
      } as any);
    } catch (err) {
      console.error("Erro ao criar curso:", err);
      alert("Erro ao criar curso. Tente novamente.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Você precisa estar autenticado para postar um curso.</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Curso Enviado!</h2>
            <p className="text-gray-600 text-center mb-6">
              Seu curso foi enviado para aprovação. Você receberá uma notificação quando for aprovado.
            </p>
            <Button
              onClick={() => navigate("/institution-dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Ir para Meu Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={() => {
            if (step === "form") {
              setStep("type");
              setRequestType(null);
            } else {
              navigate("/institution-dashboard");
            }
          }}
          variant="outline"
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        {/* Passo 1: Escolher Tipo */}
        {step === "type" && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Postar Novo Curso</h1>
            <p className="text-gray-600 mb-8">
              Escolha como você deseja publicar seu curso
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opção 1: Com Link Externo */}
              <Card
                className={`cursor-pointer transition-all ${
                  requestType === "public_link"
                    ? "border-blue-500 border-2 bg-blue-50"
                    : "hover:shadow-lg"
                }`}
                onClick={() => {
                  setRequestType("public_link");
                  setStep("form");
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Com Link Externo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Redireciona alunos para sua plataforma de cursos
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Controle total do processo</li>
                    <li>✓ Integração com sua plataforma</li>
                    <li>✓ Gestão de alunos centralizada</li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Escolher
                  </Button>
                </CardContent>
              </Card>

              {/* Opção 2: Sem Link Externo */}
              <Card
                className={`cursor-pointer transition-all ${
                  requestType === "full_form"
                    ? "border-green-500 border-2 bg-green-50"
                    : "hover:shadow-lg"
                }`}
                onClick={() => {
                  setRequestType("full_form");
                  setStep("form");
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Sem Link Externo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Alunos se inscrevem diretamente via email, WhatsApp ou seu site
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Sem necessidade de plataforma própria</li>
                    <li>✓ Inscrições por email ou WhatsApp</li>
                    <li>✓ Simples e direto</li>
                  </ul>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Escolher
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Passo 2: Formulário */}
        {step === "form" && requestType && (
          <Card>
            <CardHeader>
              <CardTitle>
                {requestType === "public_link" ? "Com Link Externo" : "Sem Link Externo"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título do Curso *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Python para Iniciantes"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descreva o curso, conteúdo, público-alvo..."
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Link Externo (se aplicável) */}
                {requestType === "public_link" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Link Externo</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL do Curso *
                      </label>
                      <input
                        type="url"
                        value={formData.externalLink}
                        onChange={(e) =>
                          setFormData({ ...formData, externalLink: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://sua-plataforma.com/curso/123"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Inscrição (se aplicável) */}
                {requestType === "full_form" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Como Receber Inscrições</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Inscrição *
                        </label>
                        <div className="space-y-2">
                          {["email", "whatsapp", "website"].map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="radio"
                                name="applicationType"
                                value={type}
                                checked={formData.applicationType === type}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    applicationType: e.target.value as any,
                                  })
                                }
                                className="mr-2"
                              />
                              <span className="capitalize">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {formData.applicationType === "email"
                            ? "Email para Inscrições"
                            : formData.applicationType === "whatsapp"
                            ? "Número WhatsApp"
                            : "URL do Site de Inscrição"}{" "}
                          *
                        </label>
                        <input
                          type={
                            formData.applicationType === "email"
                              ? "email"
                              : formData.applicationType === "whatsapp"
                              ? "tel"
                              : "url"
                          }
                          value={formData.applicationRedirect}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              applicationRedirect: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={
                            formData.applicationType === "email"
                              ? "cursos@instituicao.com"
                              : formData.applicationType === "whatsapp"
                              ? "(11) 99999-9999"
                              : "https://sua-instituicao.com/inscricoes"
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Detalhes do Curso */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Detalhes do Curso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="São Paulo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="SP"
                        maxLength={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modalidade
                      </label>
                      <select
                        value={formData.modality}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            modality: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="presencial">Presencial</option>
                        <option value="online">Online</option>
                        <option value="hibrido">Híbrido</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nível
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            level: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="iniciante">Iniciante</option>
                        <option value="intermediario">Intermediário</option>
                        <option value="avancado">Avançado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço (opcional)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="500"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.priceVisible}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              priceVisible: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Mostrar preço
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duração (ex: 40 horas, 2 meses)
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="40 horas"
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-2 pt-6 border-t">
                  <Button
                    type="button"
                    onClick={() => {
                      setStep("type");
                      setRequestType(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Enviando..." : "Enviar para Aprovação"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
