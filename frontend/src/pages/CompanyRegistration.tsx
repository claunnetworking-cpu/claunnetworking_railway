import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CompanyRegistration() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"company" | "credentials" | "payment" | "success">("company");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    businessArea: "",
    contractResponsible: "",
    responsibleEmail: "",
    businessPhone: "",
    whatsapp: "",
    loginEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateCompanyStep = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) newErrors.companyName = "Nome da empresa é obrigatório";
    if (!formData.cnpj.trim()) newErrors.cnpj = "CNPJ é obrigatório";
    if (!formData.businessArea.trim()) newErrors.businessArea = "Área de atuação é obrigatória";
    if (!formData.contractResponsible.trim()) newErrors.contractResponsible = "Nome do responsável é obrigatório";
    if (!formData.responsibleEmail.trim()) newErrors.responsibleEmail = "Email é obrigatório";
    if (!formData.businessPhone.trim()) newErrors.businessPhone = "Telefone comercial é obrigatório";
    if (!formData.whatsapp.trim()) newErrors.whatsapp = "WhatsApp é obrigatório";

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
    if (step === "company" && validateCompanyStep()) {
      setStep("credentials");
    } else if (step === "credentials" && validateCredentialsStep()) {
      setStep("payment");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Aqui você integraria com Stripe
      // Por enquanto, simulamos sucesso
      setTimeout(() => {
        setStep("success");
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Erro no pagamento:", error);
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setLocation("/company-dashboard");
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
          <h1 className="text-4xl font-bold text-purple-900">Cadastro de Empresa</h1>
          <p className="text-purple-700 mt-2">Preencha os dados para começar a publicar vagas</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {["company", "credentials", "payment", "success"].map((s, idx) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                ["company", "credentials", "payment", "success"].indexOf(step) >= idx
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
              {step === "company" && "Dados da Empresa"}
              {step === "credentials" && "Credenciais de Acesso"}
              {step === "payment" && "Confirmação de Pagamento"}
              {step === "success" && "Cadastro Realizado!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Step 1: Company Data */}
            {step === "company" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Ex: Tech Solutions LTDA"
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <Input
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    placeholder="XX.XXX.XXX/0001-XX"
                    className={errors.cnpj ? "border-red-500" : ""}
                  />
                  {errors.cnpj && <p className="text-red-500 text-sm mt-1">{errors.cnpj}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área de Atuação</label>
                  <Input
                    name="businessArea"
                    value={formData.businessArea}
                    onChange={handleInputChange}
                    placeholder="Ex: Tecnologia, Recursos Humanos"
                    className={errors.businessArea ? "border-red-500" : ""}
                  />
                  {errors.businessArea && <p className="text-red-500 text-sm mt-1">{errors.businessArea}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável pelo Contrato</label>
                  <Input
                    name="contractResponsible"
                    value={formData.contractResponsible}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva"
                    className={errors.contractResponsible ? "border-red-500" : ""}
                  />
                  {errors.contractResponsible && <p className="text-red-500 text-sm mt-1">{errors.contractResponsible}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email do Responsável</label>
                  <Input
                    name="responsibleEmail"
                    type="email"
                    value={formData.responsibleEmail}
                    onChange={handleInputChange}
                    placeholder="joao@empresa.com"
                    className={errors.responsibleEmail ? "border-red-500" : ""}
                  />
                  {errors.responsibleEmail && <p className="text-red-500 text-sm mt-1">{errors.responsibleEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Comercial</label>
                  <Input
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    placeholder="(11) 3000-0000"
                    className={errors.businessPhone ? "border-red-500" : ""}
                  />
                  {errors.businessPhone && <p className="text-red-500 text-sm mt-1">{errors.businessPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <Input
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    className={errors.whatsapp ? "border-red-500" : ""}
                  />
                  {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
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
                    placeholder="seu-email@empresa.com"
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
                      <span className="text-gray-700">Empresa:</span>
                      <span className="font-semibold">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Plano:</span>
                      <span className="font-semibold">Publicação de Vagas</span>
                    </div>
                    <div className="border-t border-purple-200 pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-purple-600">R$ 99,90</span>
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
                  <p className="text-gray-600">Sua empresa está pronta para publicar vagas. Você será redirecionado para o painel em breve.</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              {step !== "success" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === "company") setLocation("/");
                    else if (step === "credentials") setStep("company");
                    else if (step === "payment") setStep("credentials");
                  }}
                  className="flex-1"
                >
                  {step === "company" ? "Cancelar" : "Voltar"}
                </Button>
              )}

              {step === "company" && (
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
