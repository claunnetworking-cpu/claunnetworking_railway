import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

/**
 * MentorPostMentorshipV2
 * 
 * Formulário para mentores postarem mentorias.
 * Mesmo fluxo que CompanyPostJobV2 mas para mentorias.
 * 
 * Opções:
 * 1. COM LINK EXTERNO: Redireciona para URL externa (site, Calendly, etc)
 * 2. SEM LINK EXTERNO: Formulário integrado (email, WhatsApp, site)
 */

type MentorshipType = "public_link" | "full_form" | null;
type ApplicationType = "email" | "whatsapp" | "website";

export default function MentorPostMentorshipV2() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [mentorshipType, setMentorshipType] = useState<MentorshipType>(null);
  const [applicationType, setApplicationType] = useState<ApplicationType>("email");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    externalLink: "",
    applicationRedirect: "",
    startDate: "",
    endDate: "",
  });

  const createMutation = trpc.serviceRequests.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!mentorshipType) {
        throw new Error("Selecione o tipo de mentoria");
      }

      if (!formData.title.trim()) {
        throw new Error("Título é obrigatório");
      }

      if (!formData.description.trim() || formData.description.length < 10) {
        throw new Error("Descrição deve ter pelo menos 10 caracteres");
      }

      if (mentorshipType === "public_link" && !formData.externalLink) {
        throw new Error("Link externo é obrigatório para mentorias com link");
      }

      if (mentorshipType === "full_form" && !formData.applicationRedirect) {
        throw new Error("Informação de contato é obrigatória");
      }

      if (!formData.startDate || !formData.endDate) {
        throw new Error("Datas de início e fim são obrigatórias");
      }

      const result = await createMutation.mutateAsync({
        serviceType: "mentorship",
        requestType: mentorshipType,
        title: formData.title,
        description: formData.description,
        externalLink: mentorshipType === "public_link" ? formData.externalLink : undefined,
        applicationType: mentorshipType === "full_form" ? applicationType : "email",
        applicationRedirect: formData.applicationRedirect,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });



      setSuccess(true);
      setTimeout(() => {
        navigate("/mentor-dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao postar mentoria");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Você precisa estar autenticado para postar uma mentoria.</p>
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Postar Mentoria</h1>
        <p className="text-gray-600 mb-8">Escolha como deseja disponibilizar sua mentoria</p>

        {/* Tipo de Mentoria */}
        {!mentorshipType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Com Link Externo */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => setMentorshipType("public_link")}
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🔗</div>
                  <h3 className="text-lg font-semibold mb-2">Com Link Externo</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Redireciona para seu site, Calendly, Zoom ou plataforma externa
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Selecionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sem Link Externo */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500"
              onClick={() => setMentorshipType("full_form")}
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold mb-2">Sem Link Externo</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Candidatos se inscrevem via email, WhatsApp ou seu site
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Selecionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Formulário */}
        {mentorshipType && (
          <Card>
            <CardHeader>
              <CardTitle>
                {mentorshipType === "public_link" ? "Mentoria com Link Externo" : "Mentoria com Formulário"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Erro */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                {/* Sucesso */}
                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Mentoria postada com sucesso! Redirecionando...
                  </div>
                )}

                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Mentoria *
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Mentoria em Desenvolvimento Web"
                    required
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva sua mentoria, experiência, o que você vai ensinar..."
                    rows={4}
                    required
                  />
                </div>

                {/* Datas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início *
                    </label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Fim *
                    </label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Com Link Externo */}
                {mentorshipType === "public_link" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Externo *
                    </label>
                    <Input
                      type="url"
                      name="externalLink"
                      value={formData.externalLink}
                      onChange={handleInputChange}
                      placeholder="https://calendly.com/seu-usuario ou https://zoom.us/..."
                      required
                    />
                  </div>
                )}

                {/* Sem Link Externo */}
                {mentorshipType === "full_form" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Como os candidatos devem entrar em contato? *
                      </label>
                      <div className="space-y-2">
                        {(["email", "whatsapp", "website"] as const).map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="radio"
                              name="applicationType"
                              value={type}
                              checked={applicationType === type}
                              onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
                              className="mr-2"
                            />
                            <span className="text-sm">
                              {type === "email" && "📧 Email"}
                              {type === "whatsapp" && "💬 WhatsApp"}
                              {type === "website" && "🌐 Site"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {applicationType === "email"
                          ? "Email para Contato *"
                          : applicationType === "whatsapp"
                          ? "Número WhatsApp *"
                          : "URL do Site *"}
                      </label>
                      <Input
                        type={applicationType === "email" ? "email" : "text"}
                        name="applicationRedirect"
                        value={formData.applicationRedirect}
                        onChange={handleInputChange}
                        placeholder={
                          applicationType === "email"
                            ? "seu-email@exemplo.com"
                            : applicationType === "whatsapp"
                            ? "+55 11 99999-9999"
                            : "https://seu-site.com"
                        }
                        required
                      />
                    </div>
                  </>
                )}

                {/* Botões */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMentorshipType(null)}
                    disabled={loading}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Postando..." : "Postar Mentoria"}
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
