import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function MentorRegistration() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"mentor" | "credentials" | "payment" | "success">("mentor");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    professionalName: "",
    businessArea: "",
    bio: "",
    instagram: "",
    whatsapp: "",
    website: "",
    repostLink: "",
    serviceDescription: "",
    targetAudience: "",
    differential: "",
    loginEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateMentorStep = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Nome completo é obrigatório";
    if (!formData.professionalName.trim()) newErrors.professionalName = "Nome profissional é obrigatório";
    if (!formData.businessArea.trim()) newErrors.businessArea = "Área de atuação é obrigatória";
    if (!formData.bio.trim()) newErrors.bio = "Bio curta é obrigatória";
    if (!formData.instagram.trim()) newErrors.instagram = "Instagram é obrigatório";
    if (!formData.serviceDescription.trim()) newErrors.serviceDescription = "Descrição do serviço é obrigatória";
    if (!formData.targetAudience.trim()) newErrors.targetAudience = "Público-alvo é obrigatório";
    if (!formData.differential.trim()) newErrors.differential = "Diferencial é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCredentialsStep = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.loginEmail.trim()) newErrors.loginEmail = "Email de login é obrigatório";
    if (!formData.password.trim()) newErrors.password = "Senha é obrigatória";
    if (formData.password.length < 8) newErrors.password = "Senha deve ter no mínimo 8 caracteres";
    if (!/[A-Z]/.test(formData.password)) newErrors.password = "Senha deve conter letras maiúsculas";
    if (!/[0-9]/.test(formData.password)) newErrors.password = "Senha deve conter números";
    if (!/[!@#$%^&*]/.test(formData.password)) newErrors.password = "Senha deve conter caracteres especiais (!@#$%^&*)";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Senhas não conferem";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === "mentor" && validateMentorStep()) {
      setStep("credentials");
    } else if (step === "credentials" && validateCredentialsStep()) {
      setStep("payment");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Redirecionar para Stripe Checkout
      const productId = new URLSearchParams(window.location.search).get('productId');
      const checkoutUrl = `/payment-checkout?type=mentor&productId=${productId}`;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Erro no pagamento:", error);
      setErrors({ payment: "Erro ao processar pagamento" });
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setLocation("/mentor-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-purple-900">Cadastro de Mentor</h1>
          <p className="text-purple-700 mt-2">Preencha os dados para começar sua divulgação profissional</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {["mentor", "credentials", "payment", "success"].map((s, idx) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                ["mentor", "credentials", "payment", "success"].indexOf(step) >= idx
                  ? "bg-purple-600"
                  : "bg-purple-200"
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle>
              {step === "mentor" && "Dados Profissionais"}
              {step === "credentials" && "Credenciais de Acesso"}
              {step === "payment" && "Confirmação de Pagamento"}
              {step === "success" && "Cadastro Realizado!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Step 1: Mentor Data */}
            {step === "mentor" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Profissional</label>
                  <Input
                    name="professionalName"
                    value={formData.professionalName}
                    onChange={handleInputChange}
                    placeholder="Ex: João Coach"
                    className={errors.professionalName ? "border-red-500" : ""}
                  />
                  {errors.professionalName && <p className="text-red-500 text-sm mt-1">{errors.professionalName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área de Atuação</label>
                  <Input
                    name="businessArea"
                    value={formData.businessArea}
                    onChange={handleInputChange}
                    placeholder="Ex: Desenvolvimento Pessoal, Carreira"
                    className={errors.businessArea ? "border-red-500" : ""}
                  />
                  {errors.businessArea && <p className="text-red-500 text-sm mt-1">{errors.businessArea}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio Curta</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Descreva brevemente sua experiência e expertise"
                    className={`w-full p-2 border rounded-md ${errors.bio ? "border-red-500" : "border-gray-300"}`}
                    rows={3}
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (obrigatório)</label>
                  <Input
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="@seu_instagram"
                    className={errors.instagram ? "border-red-500" : ""}
                  />
                  {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (opcional)</label>
                  <Input
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website (opcional)</label>
                  <Input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://seu-site.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link da Postagem para Repost (opcional)</label>
                  <Input
                    name="repostLink"
                    value={formData.repostLink}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Serviço</label>
                  <textarea
                    name="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={handleInputChange}
                    placeholder="Descreva detalhadamente o que você oferece"
                    className={`w-full p-2 border rounded-md ${errors.serviceDescription ? "border-red-500" : "border-gray-300"}`}
                    rows={3}
                  />
                  {errors.serviceDescription && <p className="text-red-500 text-sm mt-1">{errors.serviceDescription}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Público-Alvo</label>
                  <Input
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="Ex: Profissionais em transição de carreira"
                    className={errors.targetAudience ? "border-red-500" : ""}
                  />
                  {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diferencial</label>
                  <Input
                    name="differential"
                    value={formData.differential}
                    onChange={handleInputChange}
                    placeholder="O que te diferencia de outros mentores?"
                    className={errors.differential ? "border-red-500" : ""}
                  />
                  {errors.differential && <p className="text-red-500 text-sm mt-1">{errors.differential}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Credentials */}
            {step === "credentials" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Requisitos de Senha:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Mínimo 8 caracteres</li>
                      <li>Letras maiúsculas (A-Z)</li>
                      <li>Números (0-9)</li>
                      <li>Caracteres especiais (!@#$%^&*)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email de Login</label>
                  <Input
                    name="loginEmail"
                    type="email"
                    value={formData.loginEmail}
                    onChange={handleInputChange}
                    placeholder="seu-email@exemplo.com"
                    className={errors.loginEmail ? "border-red-500" : ""}
                  />
                  {errors.loginEmail && <p className="text-red-500 text-sm mt-1">{errors.loginEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === "payment" && (
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-3">Resumo do Pedido</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Mentor:</span>
                      <span className="font-semibold">{formData.professionalName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Serviço:</span>
                      <span className="font-semibold">Divulgação Profissional</span>
                    </div>
                    <div className="border-t border-purple-200 pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-purple-600">A definir conforme plano</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Ao clicar em "Confirmar Pagamento", você será redirecionado para o Stripe para completar a transação de forma segura.
                </p>
              </div>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <div className="text-center space-y-4 py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Realizado com Sucesso!</h3>
                  <p className="text-gray-600">Seu perfil está pronto para divulgação. Você será redirecionado para o painel em breve.</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              {step !== "success" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === "mentor") setLocation("/");
                    else if (step === "credentials") setStep("mentor");
                    else if (step === "payment") setStep("credentials");
                  }}
                  className="flex-1"
                >
                  {step === "mentor" ? "Cancelar" : "Voltar"}
                </Button>
              )}

              {step === "mentor" && (
                <Button onClick={handleNextStep} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Próximo
                </Button>
              )}

              {step === "credentials" && (
                <Button onClick={handleNextStep} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Próximo
                </Button>
              )}

              {step === "payment" && (
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Processando..." : "Confirmar Pagamento"}
                </Button>
              )}

              {step === "success" && (
                <Button onClick={handleSuccess} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Ir para Painel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
