import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CandidateRegistration() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"personal" | "professional" | "payment" | "success">("personal");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [includePhoto, setIncludePhoto] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    photoUrl: "",
    resumeUrl: "",
    professionalObjective: "",
    businessArea: "",
    professionalSummary: "",
    technicalSkills: "",
    behavioralSkills: "",
    jobLink: "",
    company: "",
    observations: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validatePersonalStep = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Nome completo é obrigatório";
    if (!formData.birthDate.trim()) newErrors.birthDate = "Data de nascimento é obrigatória";
    if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
    if (!formData.state.trim()) newErrors.state = "Estado é obrigatório";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfessionalStep = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.professionalObjective.trim()) newErrors.professionalObjective = "Objetivo profissional é obrigatório";
    if (!formData.businessArea.trim()) newErrors.businessArea = "Área de atuação é obrigatória";
    if (!formData.professionalSummary.trim()) newErrors.professionalSummary = "Resumo profissional é obrigatório";
    if (!formData.technicalSkills.trim()) newErrors.technicalSkills = "Habilidades técnicas são obrigatórias";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === "personal" && validatePersonalStep()) {
      setStep("professional");
    } else if (step === "professional" && validateProfessionalStep()) {
      setStep("payment");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const serviceType = new URLSearchParams(window.location.search).get('service') || 'curriculo-simples';
      const checkoutUrl = `/payment-checkout?type=candidate&service=${serviceType}`;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Erro no pagamento:", error);
      setErrors({ payment: "Erro ao processar pagamento" });
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setLocation("/candidate-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-green-600 hover:text-green-800 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-green-900">Serviços de Currículo</h1>
          <p className="text-green-700 mt-2">Preencha seus dados para começar</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {["personal", "professional", "payment", "success"].map((s, idx) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                ["personal", "professional", "payment", "success"].indexOf(step) >= idx
                  ? "bg-green-600"
                  : "bg-green-200"
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle>
              {step === "personal" && "Dados Pessoais"}
              {step === "professional" && "Dados Profissionais"}
              {step === "payment" && "Confirmação de Pagamento"}
              {step === "success" && "Cadastro Realizado!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Step 1: Personal Data */}
            {step === "personal" && (
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                  <Input
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={errors.birthDate ? "border-red-500" : ""}
                  />
                  {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ex: São Paulo"
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Ex: SP"
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 9999-9999"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu-email@exemplo.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <input
                    type="checkbox"
                    id="includePhoto"
                    checked={includePhoto}
                    onChange={(e) => setIncludePhoto(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="includePhoto" className="text-sm text-gray-700">
                    Desejo incluir foto no currículo
                  </label>
                </div>

                {includePhoto && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload de Foto</label>
                    <Input
                      name="photoUrl"
                      type="file"
                      onChange={handleInputChange}
                      accept="image/*"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currículo Existente (opcional)</label>
                  <Input
                    name="resumeUrl"
                    type="file"
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos aceitos: PDF, DOC, DOCX</p>
                </div>
              </div>
            )}

            {/* Step 2: Professional Data */}
            {step === "professional" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo Profissional</label>
                  <Input
                    name="professionalObjective"
                    value={formData.professionalObjective}
                    onChange={handleInputChange}
                    placeholder="Ex: Desenvolvedor Full Stack Senior"
                    className={errors.professionalObjective ? "border-red-500" : ""}
                  />
                  {errors.professionalObjective && <p className="text-red-500 text-sm mt-1">{errors.professionalObjective}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área de Atuação</label>
                  <Input
                    name="businessArea"
                    value={formData.businessArea}
                    onChange={handleInputChange}
                    placeholder="Ex: Tecnologia, Desenvolvimento"
                    className={errors.businessArea ? "border-red-500" : ""}
                  />
                  {errors.businessArea && <p className="text-red-500 text-sm mt-1">{errors.businessArea}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resumo Profissional</label>
                  <textarea
                    name="professionalSummary"
                    value={formData.professionalSummary}
                    onChange={handleInputChange}
                    placeholder="Descreva sua experiência profissional em poucas linhas"
                    className={`w-full p-2 border rounded-md ${errors.professionalSummary ? "border-red-500" : "border-gray-300"}`}
                    rows={4}
                  />
                  {errors.professionalSummary && <p className="text-red-500 text-sm mt-1">{errors.professionalSummary}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades Técnicas</label>
                  <textarea
                    name="technicalSkills"
                    value={formData.technicalSkills}
                    onChange={handleInputChange}
                    placeholder="Ex: JavaScript, React, Node.js, SQL"
                    className={`w-full p-2 border rounded-md ${errors.technicalSkills ? "border-red-500" : "border-gray-300"}`}
                    rows={3}
                  />
                  {errors.technicalSkills && <p className="text-red-500 text-sm mt-1">{errors.technicalSkills}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades Comportamentais (opcional)</label>
                  <textarea
                    name="behavioralSkills"
                    value={formData.behavioralSkills}
                    onChange={handleInputChange}
                    placeholder="Ex: Liderança, Comunicação, Trabalho em equipe"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Currículo Direcionado (opcional)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link da Vaga</label>
                      <Input
                        name="jobLink"
                        value={formData.jobLink}
                        onChange={handleInputChange}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Nome da empresa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                      <textarea
                        name="observations"
                        value={formData.observations}
                        onChange={handleInputChange}
                        placeholder="Informações adicionais sobre a vaga"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === "payment" && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3">Resumo do Pedido</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Candidato:</span>
                      <span className="font-semibold">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Serviço:</span>
                      <span className="font-semibold">Currículo Profissional</span>
                    </div>
                    <div className="border-t border-green-200 pt-2 mt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">A definir conforme serviço</span>
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
                  <p className="text-gray-600">Seu pedido foi recebido. Você será redirecionado para o painel em breve.</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              {step !== "success" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === "personal") setLocation("/");
                    else if (step === "professional") setStep("personal");
                    else if (step === "payment") setStep("professional");
                  }}
                  className="flex-1"
                >
                  {step === "personal" ? "Cancelar" : "Voltar"}
                </Button>
              )}

              {step === "personal" && (
                <Button onClick={handleNextStep} className="flex-1 bg-green-600 hover:bg-green-700">
                  Próximo
                </Button>
              )}

              {step === "professional" && (
                <Button onClick={handleNextStep} className="flex-1 bg-green-600 hover:bg-green-700">
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
                <Button onClick={handleSuccess} className="flex-1 bg-green-600 hover:bg-green-700">
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
