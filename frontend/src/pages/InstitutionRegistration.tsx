import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function InstitutionRegistration() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"institution" | "credentials" | "payment" | "success">("institution");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    institutionName: "",
    courseName: "",
    courseDescription: "",
    targetAudience: "",
    inscriptionLink: "",
    instagram: "",
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

  const validateInstitutionStep = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.institutionName.trim()) newErrors.institutionName = "Nome da instituição é obrigatório";
    if (!formData.courseName.trim()) newErrors.courseName = "Nome do curso é obrigatório";
    if (!formData.courseDescription.trim()) newErrors.courseDescription = "Descrição do curso é obrigatória";
    if (!formData.targetAudience.trim()) newErrors.targetAudience = "Público-alvo é obrigatório";
    if (!formData.inscriptionLink.trim()) newErrors.inscriptionLink = "Link de inscrição é obrigatório";
    if (!formData.instagram.trim()) newErrors.instagram = "Instagram é obrigatório";

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
    if (step === "institution" && validateInstitutionStep()) {
      setStep("credentials");
    } else if (step === "credentials" && validateCredentialsStep()) {
      setStep("payment");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const productId = new URLSearchParams(window.location.search).get('productId');
      const checkoutUrl = `/payment-checkout?type=institution&productId=${productId}`;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Erro no pagamento:", error);
      setErrors({ payment: "Erro ao processar pagamento" });
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setLocation("/institution-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-blue-900">Cadastro de Instituição</h1>
          <p className="text-blue-700 mt-2">Preencha os dados para começar a divulgar seus cursos</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {["institution", "credentials", "payment", "success"].map((s, idx) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                ["institution", "credentials", "payment", "success"].indexOf(step) >= idx
                  ? "bg-blue-600"
                  : "bg-blue-200"
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle>
              {step === "institution" && "Dados da Instituição"}
              {step === "credentials" && "Credenciais de Acesso"}
              {step === "payment" && "Confirmação de Pagamento"}
              {step === "success" && "Cadastro Realizado!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Step 1: Institution Data */}
            {step === "institution" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Instituição</label>
                  <Input
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    placeholder="Ex: Universidade ABC"
                    className={errors.institutionName ? "border-red-500" : ""}
                  />
                  {errors.institutionName && <p className="text-red-500 text-sm mt-1">{errors.institutionName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso</label>
                  <Input
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    placeholder="Ex: Desenvolvimento Web Avançado"
                    className={errors.courseName ? "border-red-500" : ""}
                  />
                  {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Curso</label>
                  <textarea
                    name="courseDescription"
                    value={formData.courseDescription}
                    onChange={handleInputChange}
                    placeholder="Descreva detalhadamente o conteúdo e objetivos do curso"
                    className={`w-full p-2 border rounded-md ${errors.courseDescription ? "border-red-500" : "border-gray-300"}`}
                    rows={4}
                  />
                  {errors.courseDescription && <p className="text-red-500 text-sm mt-1">{errors.courseDescription}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Público-Alvo</label>
                  <Input
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="Ex: Profissionais em transição, iniciantes em programação"
                    className={errors.targetAudience ? "border-red-500" : ""}
                  />
                  {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link de Inscrição</label>
                  <Input
                    name="inscriptionLink"
                    value={formData.inscriptionLink}
                    onChange={handleInputChange}
                    placeholder="https://seu-site.com/inscricao"
                    className={errors.inscriptionLink ? "border-red-500" : ""}
                  />
                  {errors.inscriptionLink && <p className="text-red-500 text-sm mt-1">{errors.inscriptionLink}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <Input
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="@sua_instituicao"
                    className={errors.instagram ? "border-red-500" : ""}
                  />
                  {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
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
                    placeholder="seu-email@instituicao.com"
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Resumo do Pedido</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Instituição:</span>
                      <span className="font-semibold">{formData.institutionName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Curso:</span>
                      <span className="font-semibold">{formData.courseName}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">A definir conforme plano</span>
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
                  <p className="text-gray-600">Sua instituição está pronta para divulgar cursos. Você será redirecionado para o painel em breve.</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              {step !== "success" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === "institution") setLocation("/");
                    else if (step === "credentials") setStep("institution");
                    else if (step === "payment") setStep("credentials");
                  }}
                  className="flex-1"
                >
                  {step === "institution" ? "Cancelar" : "Voltar"}
                </Button>
              )}

              {step === "institution" && (
                <Button onClick={handleNextStep} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Próximo
                </Button>
              )}

              {step === "credentials" && (
                <Button onClick={handleNextStep} className="flex-1 bg-blue-600 hover:bg-blue-700">
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
                <Button onClick={handleSuccess} className="flex-1 bg-blue-600 hover:bg-blue-700">
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
