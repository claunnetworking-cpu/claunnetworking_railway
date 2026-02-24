import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface CreateJobFormProps {
  onSuccess?: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps = {}) {
  const [jobType, setJobType] = useState<"vaga_com_link" | "vaga_sem_link">("vaga_com_link");
  const [jobTitle, setJobTitle] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validações
  const validateJobMutation = trpc.jobValidation.validateJobPublish.useQuery(
    { jobType, jobTitle, jobLink: jobType === "vaga_com_link" ? jobLink : undefined },
    { enabled: jobTitle.length > 2 }
  );

  const checkDuplicateMutation = trpc.jobValidation.checkDuplicateLink.useQuery(
    { jobLink },
    { enabled: jobType === "vaga_com_link" && jobLink.length > 0 }
  );

  const getJobLimitQuery = trpc.jobValidation.getJobLimit.useQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validar limite
      if (!validateJobMutation.data?.valid) {
        setError(validateJobMutation.data?.message || "Não é possível publicar esta vaga");
        setLoading(false);
        return;
      }

      // Validar link duplicado
      if (jobType === "vaga_com_link" && checkDuplicateMutation.data?.isDuplicate) {
        setError("Este link já foi publicado anteriormente. Por favor, use um link diferente.");
        setLoading(false);
        return;
      }

      // TODO: Enviar para API
      console.log("Publicando vaga:", { jobType, jobTitle, jobLink });

      setSuccess(true);
      setJobTitle("");
      setJobLink("");
      
      // Chamar callback de sucesso após 1 segundo
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (err) {
      setError("Erro ao publicar vaga. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Publicar Nova Vaga</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Limite de Vagas */}
        {getJobLimitQuery.data && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Vagas Disponíveis:</strong> {getJobLimitQuery.data.remainingJobs} de{" "}
              {getJobLimitQuery.data.jobLimit}
            </p>
            {getJobLimitQuery.data.remainingJobs === 0 && (
              <p className="text-sm text-red-600 mt-2">
                Você atingiu o limite de vagas. Faça upgrade do seu plano para publicar mais.
              </p>
            )}
          </div>
        )}

        {/* Mensagens de Erro/Sucesso */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">Vaga publicada com sucesso!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Vaga */}
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Vaga</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="vaga_com_link"
                  checked={jobType === "vaga_com_link"}
                  onChange={(e) => setJobType(e.target.value as "vaga_com_link")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Vaga com Link Público</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="vaga_sem_link"
                  checked={jobType === "vaga_sem_link"}
                  onChange={(e) => setJobType(e.target.value as "vaga_sem_link")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Vaga Completa (sem Link)</span>
              </label>
            </div>
          </div>

          {/* Título da Vaga */}
          <div>
            <label className="block text-sm font-medium mb-2">Título da Vaga *</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Ex: Desenvolvedor Full Stack"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            {jobTitle.length > 2 && validateJobMutation.data && (
              <p className="text-xs text-green-600 mt-1">✓ Título válido</p>
            )}
          </div>

          {/* Link da Vaga (se com link) */}
          {jobType === "vaga_com_link" && (
            <div>
              <label className="block text-sm font-medium mb-2">Link para Divulgação *</label>
              <input
                type="url"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
                placeholder="https://exemplo.com/vaga"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              {jobLink && checkDuplicateMutation.data && (
                <p
                  className={`text-xs mt-1 ${
                    checkDuplicateMutation.data.isDuplicate ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {checkDuplicateMutation.data.isDuplicate
                    ? "⚠ Este link já foi publicado"
                    : "✓ Link disponível"}
                </p>
              )}
            </div>
          )}

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={loading || getJobLimitQuery.data?.remainingJobs === 0}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? "Publicando..." : "Publicar Vaga"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
