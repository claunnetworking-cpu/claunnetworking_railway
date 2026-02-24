import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Check, X, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Parameter {
  id: string;
  parameterName: string;
  parameterValue: string;
  description?: string;
  category: string;
  isValid: boolean;
  validationError?: string;
}

// Validadores específicos
const validators = {
  urls: (value: string) => {
    try {
      new URL(value);
      return { isValid: true };
    } catch {
      return { isValid: false, error: "URL inválida" };
    }
  },
  api_keys: (value: string) => {
    if (value.length < 10) {
      return { isValid: false, error: "Chave de API muito curta (mínimo 10 caracteres)" };
    }
    return { isValid: true };
  },
  limits: (value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) {
      return { isValid: false, error: "Deve ser um número positivo" };
    }
    return { isValid: true };
  },
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, error: "Email inválido" };
    }
    return { isValid: true };
  },
};

export default function SystemParametersTab() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newParam, setNewParam] = useState({
    parameterName: "",
    parameterValue: "",
    description: "",
    category: "urls" as const,
  });

  // Queries
  const { data: parametersData, isLoading, refetch } = trpc.systemConfig.listParameters.useQuery();
  const parameters = parametersData?.data || [];

  // Mutations
  const createMutation = trpc.systemConfig.createParameter.useMutation({
    onSuccess: () => {
      console.log("Parâmetro criado com sucesso");
      setShowNewForm(false);
      setNewParam({ parameterName: "", parameterValue: "", description: "", category: "urls" });
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao criar parâmetro:", error.message);
    },
  });

  const updateMutation = trpc.systemConfig.updateParameter.useMutation({
    onSuccess: () => {
      console.log("Parâmetro atualizado com sucesso");
      setEditingId(null);
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao atualizar parâmetro:", error.message);
    },
  });

  const deleteMutation = trpc.systemConfig.deleteParameter.useMutation({
    onSuccess: () => {
      console.log("Parâmetro deletado com sucesso");
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao deletar parâmetro:", error.message);
    },
  });

  const handleCreateParameter = async () => {
    if (!newParam.parameterName || !newParam.parameterValue) {
      console.error("Preencha todos os campos obrigatórios");
      return;
    }

    await createMutation.mutateAsync(newParam);
  };

  const handleSave = async (id: string, category: string) => {
    const validator = validators[category as keyof typeof validators];
    let isValid = true;
    let validationError = "";

    if (validator) {
      const result = validator(editValue);
      isValid = result.isValid;
      validationError = result.error || "";
    }

    await updateMutation.mutateAsync({
      id,
      parameterValue: editValue,
      isValid,
      validationError: validationError || undefined,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este parâmetro?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      urls: "bg-blue-100 text-blue-800",
      api_keys: "bg-red-100 text-red-800",
      integrations: "bg-purple-100 text-purple-800",
      limits: "bg-yellow-100 text-yellow-800",
      environment: "bg-green-100 text-green-800",
      email: "bg-orange-100 text-orange-800",
      security: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Parâmetros do Sistema</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure parâmetros técnicos sem necessidade de alterar código
          </p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Parâmetro
        </Button>
      </div>

      {/* Formulário de novo parâmetro */}
      {showNewForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Adicionar Novo Parâmetro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nome do Parâmetro"
                value={newParam.parameterName}
                onChange={(e) => setNewParam({ ...newParam, parameterName: e.target.value })}
              />
              <Input
                placeholder="Valor"
                value={newParam.parameterValue}
                onChange={(e) => setNewParam({ ...newParam, parameterValue: e.target.value })}
              />
              <Input
                placeholder="Descrição"
                value={newParam.description}
                onChange={(e) => setNewParam({ ...newParam, description: e.target.value })}
                className="md:col-span-2"
              />
              <select
                className="px-3 py-2 border border-border rounded-md"
                value={newParam.category}
                onChange={(e) =>
                  setNewParam({ ...newParam, category: e.target.value as any })
                }
              >
                <option value="urls">URLs</option>
                <option value="api_keys">Chaves de API</option>
                <option value="integrations">Integrações</option>
                <option value="limits">Limites</option>
                <option value="environment">Ambiente</option>
                <option value="email">Email</option>
                <option value="security">Segurança</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={handleCreateParameter}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de parâmetros */}
      <div className="space-y-3">
        {parameters.map((param) => (
          <Card key={param.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {param.parameterName}
                      </h3>
                      <Badge className={getCategoryColor(param.category)}>
                        {param.category}
                      </Badge>
                      {param.isValid ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-medium">Válido</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <X className="w-4 h-4" />
                          <span className="text-xs font-medium">Inválido</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{param.description}</p>
                  </div>
                </div>

                {/* Valor */}
                <div className="bg-muted p-3 rounded-md">
                  {editingId === param.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <code className="text-sm text-foreground font-mono break-all">
                      {param.parameterValue}
                    </code>
                  )}
                </div>

                {/* Mensagem de erro */}
                {param.validationError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">
                      <strong>Erro:</strong> {param.validationError}
                    </p>
                  </div>
                )}

                {/* Botões de ação */}
                <div className="flex gap-2 justify-end">
                  {editingId === param.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleSave(param.id, param.category)}
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Gravar
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(param.id);
                          setEditValue(param.parameterValue);
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(param.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {parameters.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Nenhum parâmetro configurado</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowNewForm(true)}>
              Criar Primeiro Parâmetro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
