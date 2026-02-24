import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { AlertCircle, ArrowLeft, Mail, MessageCircle, Globe } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * CourseDetailPage
 * 
 * Página pública para visualizar detalhes de um curso via link compartilhável.
 * 
 * Fluxo:
 * 1. Candidato recebe link: /course/{UUID}
 * 2. Página carrega detalhes do curso
 * 3. Se curso com link externo: mostra botão "Acessar Curso"
 * 4. Se curso sem link externo: mostra formulário de inscrição
 * 5. Rastreia cliques
 */

export default function CourseDetailPage() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/course/:sharedLink");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const sharedLink = (params?.sharedLink as string) || "";

  // Buscar detalhes do curso
  const { data: course, isLoading, error } = trpc.serviceRequests.getBySharedLink.useQuery(
    { sharedLink },
    { enabled: !!sharedLink }
  );

  // Rastrear clique quando página carrega (implementar no backend se necessário)
  useEffect(() => {
    if (course && sharedLink) {
      // TODO: Implementar rastreamento de cliques no backend
      console.log("Clique rastreado para:", sharedLink);
    }
  }, [course, sharedLink]);

  // Se for link externo, redirecionar automaticamente
  useEffect(() => {
    if (
      course &&
      course.requestType === "public_link" &&
      course.externalLink
    ) {
      // Aguardar um pouco para mostrar a página antes de redirecionar
      const timer = setTimeout(() => {
        if (course.externalLink) {
          window.open(course.externalLink, "_blank");
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Nome e email são obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      // Enviar inscrição via email/WhatsApp/website
      if (course?.applicationType === "email") {
        // Abrir cliente de email
        const subject = encodeURIComponent(`Inscrição no Curso: ${course.title}`);
        const body = encodeURIComponent(
          `Nome: ${formData.name}\nEmail: ${formData.email}\nTelefone: ${formData.phone}\n\nMensagem:\n${formData.message}`
        );
        window.location.href = `mailto:${course.applicationRedirect}?subject=${subject}&body=${body}`;
      } else if (course?.applicationType === "whatsapp") {
        // Abrir WhatsApp
        const message = encodeURIComponent(
          `Olá! Gostaria de me inscrever no curso "${course.title}".\n\nNome: ${formData.name}\nEmail: ${formData.email}\nTelefone: ${formData.phone}\n\nMensagem: ${formData.message}`
        );
        if (course.applicationRedirect) {
          window.open(
            `https://wa.me/${course.applicationRedirect.replace(/\D/g, "")}?text=${message}`,
            "_blank"
          );
        }
      } else if (course?.applicationType === "website" && course.applicationRedirect) {
        // Redirecionar para website
        window.open(course.applicationRedirect, "_blank");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Erro ao enviar inscrição:", err);
      alert("Erro ao enviar inscrição. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Carregando curso...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800 mb-4">
              <AlertCircle className="w-5 h-5" />
              <p>Curso não encontrado ou link inválido.</p>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se for link externo, mostrar mensagem de redirecionamento
  if (course.requestType === "public_link" && course.externalLink) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Redirecionando...</h2>
              <p className="text-gray-600 mb-6">
                Você está sendo redirecionado para a página do curso.
              </p>
              <Button
                onClick={() => course.externalLink && window.open(course.externalLink, "_blank")}
                className="w-full bg-blue-600 hover:bg-blue-700 mb-2"
              >
                Acessar Curso
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardTitle className="text-2xl">{course.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Descrição */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Sobre o Curso</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{course.description}</p>
            </div>

            {/* Detalhes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.modality && (
                <div>
                  <p className="text-sm text-gray-600">Modalidade</p>
                  <p className="font-medium capitalize">{course.modality}</p>
                </div>
              )}

              {course.level && (
                <div>
                  <p className="text-sm text-gray-600">Nível</p>
                  <p className="font-medium capitalize">{course.level}</p>
                </div>
              )}

              {course.benefits && (
                <div>
                  <p className="text-sm text-gray-600">Duração</p>
                  <p className="font-medium">{course.benefits}</p>
                </div>
              )}

              {course.salary && course.salaryVisible && (
                <div>
                  <p className="text-sm text-gray-600">Preço</p>
                  <p className="font-medium">R$ {(typeof course.salary === 'number' ? course.salary : parseFloat(course.salary || '0')).toFixed(2)}</p>
                </div>
              )}

              {course.city && (
                <div>
                  <p className="text-sm text-gray-600">Localização</p>
                  <p className="font-medium">
                    {course.city}, {course.state}
                  </p>
                </div>
              )}
            </div>

            {/* Formulário de Inscrição */}
            {course.requestType === "full_form" && !submitted && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-4">Inscreva-se</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seu nome"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Conte um pouco sobre você..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {course.applicationType === "email" && (
                      <>
                        <Mail className="w-4 h-4" />
                        {isSubmitting ? "Enviando..." : "Enviar por Email"}
                      </>
                    )}
                    {course.applicationType === "whatsapp" && (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        {isSubmitting ? "Abrindo..." : "Enviar por WhatsApp"}
                      </>
                    )}
                    {course.applicationType === "website" && (
                      <>
                        <Globe className="w-4 h-4" />
                        {isSubmitting ? "Abrindo..." : "Ir para Site"}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* Mensagem de Sucesso */}
            {submitted && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Inscrição Enviada!
                </h3>
                <p className="text-green-700 mb-4">
                  Sua inscrição foi enviada com sucesso. A instituição entrará em contato em breve.
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-green-600 hover:bg-green-700"
                >
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
