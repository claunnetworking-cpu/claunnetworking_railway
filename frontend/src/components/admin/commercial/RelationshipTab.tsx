import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Calendar, MessageCircle } from "lucide-react";

export default function RelationshipTab() {
  const relationships = [
    { id: 1, client: "João Silva", lastContact: "2026-02-20", nextContact: "2026-02-27", satisfaction: "Excelente", actions: 2 },
    { id: 2, client: "Maria Santos", lastContact: "2026-02-18", nextContact: "2026-02-25", satisfaction: "Muito Bom", actions: 1 },
    { id: 3, client: "Pedro Costa", lastContact: "2026-01-15", nextContact: "2026-02-22", satisfaction: "Bom", actions: 3 },
    { id: 4, client: "Ana Oliveira", lastContact: "2026-02-19", nextContact: "2026-02-26", satisfaction: "Excelente", actions: 0 },
    { id: 5, client: "Carlos Mendes", lastContact: "2026-02-17", nextContact: "2026-02-24", satisfaction: "Muito Bom", actions: 1 },
  ];

  const getSatisfactionColor = (satisfaction: string) => {
    switch (satisfaction) {
      case "Excelente":
        return "bg-green-100 text-green-800";
      case "Muito Bom":
        return "bg-blue-100 text-blue-800";
      case "Bom":
        return "bg-yellow-100 text-yellow-800";
      case "Regular":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const avgSatisfaction = "Muito Bom";
  const totalClients = relationships.length;
  const activeRelationships = relationships.filter(r => new Date(r.lastContact) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestão de Relacionamento</h2>
          <p className="text-sm text-muted-foreground">Mantenha relacionamentos saudáveis com clientes</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Contato
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClients}</p>
            <p className="text-xs text-muted-foreground">Em relacionamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Relacionamentos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{activeRelationships}</p>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-600" />
              Satisfação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgSatisfaction}</p>
            <p className="text-xs text-muted-foreground">Avaliação geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{relationships.reduce((sum, r) => sum + r.actions, 0)}</p>
            <p className="text-xs text-muted-foreground">Tarefas de follow-up</p>
          </CardContent>
        </Card>
      </div>

      {/* Relacionamentos Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Histórico de Relacionamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {relationships.map((rel) => (
            <div key={rel.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{rel.client}</h3>
                  <p className="text-sm text-muted-foreground">
                    Último contato: {new Date(rel.lastContact).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge className={getSatisfactionColor(rel.satisfaction)}>
                  {rel.satisfaction}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-muted-foreground">Próximo Contato</p>
                  <p className="font-semibold">{new Date(rel.nextContact).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-xs text-muted-foreground">Ações Pendentes</p>
                  <p className="font-semibold">{rel.actions} tarefas</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Enviar Mensagem
                </button>
                <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium transition flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Agendar Contato
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Plano de Ação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Plano de Ação Pós-Venda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { phase: "Onboarding", days: "0-7", description: "Apresentação do produto e treinamento inicial" },
            { phase: "Acompanhamento", days: "7-30", description: "Verificar satisfação e resolver dúvidas" },
            { phase: "Otimização", days: "30-90", description: "Identificar oportunidades de melhoria" },
            { phase: "Retenção", days: "90+", description: "Manutenção do relacionamento e upsell" },
          ].map((plan) => (
            <div key={plan.phase} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold">{plan.phase}</h4>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{plan.days}</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
