import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StrategicPlanningTab() {
  const goals = [
    { id: 1, name: "Aumentar Receita Mensal", target: 10000, current: 5800, unit: "R$", quarter: "Q1 2026", status: "Em Andamento" },
    { id: 2, name: "Conquistar 20 Novos Clientes", target: 20, current: 12, unit: "clientes", quarter: "Q1 2026", status: "Em Andamento" },
    { id: 3, name: "Elevar Taxa de Conversão", target: 75, current: 68, unit: "%", quarter: "Q1 2026", status: "Em Andamento" },
    { id: 4, name: "Reduzir Churn de Clientes", target: 5, current: 8, unit: "%", quarter: "Q1 2026", status: "Crítico" },
  ];

  const strategies = [
    { id: 1, name: "Estratégia de Precificação", description: "Revisar e otimizar tabela de preços", status: "Implementada" },
    { id: 2, name: "Programa de Fidelização", description: "Criar programa de benefícios para clientes recorrentes", status: "Em Planejamento" },
    { id: 3, name: "Expansão de Mercado", description: "Explorar novos segmentos e regiões", status: "Em Planejamento" },
    { id: 4, name: "Parcerias Estratégicas", description: "Buscar alianças com complementadores", status: "Identificação" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return "bg-blue-100 text-blue-800";
      case "Crítico":
        return "bg-red-100 text-red-800";
      case "Implementada":
        return "bg-green-100 text-green-800";
      case "Em Planejamento":
        return "bg-yellow-100 text-yellow-800";
      case "Identificação":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const avgProgress = (goals.reduce((sum, g) => sum + ((g.current / g.target) * 100), 0) / goals.length).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Planejamento Estratégico</h2>
          <p className="text-sm text-muted-foreground">Defina metas, estratégias e acompanhe performance</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{goals.length}</p>
            <p className="text-xs text-muted-foreground">Objetivos em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Progresso Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgProgress}%</p>
            <p className="text-xs text-muted-foreground">De todas as metas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estratégias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{strategies.length}</p>
            <p className="text-xs text-muted-foreground">Planos de ação</p>
          </CardContent>
        </Card>
      </div>

      {/* Metas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Metas do Trimestre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">Meta: {goal.target} {goal.unit}</p>
                </div>
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status}
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm font-semibold">{((goal.current / goal.target) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {goal.current} de {goal.target} {goal.unit}
                </p>
              </div>

              <button className="w-full px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition">
                Acompanhar Progresso
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Estratégias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Estratégias de Negócio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {strategies.map((strategy) => (
            <div key={strategy.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{strategy.name}</h3>
                <Badge className={getStatusColor(strategy.status)}>
                  {strategy.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
              <button className="w-full px-3 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded text-sm font-medium transition">
                Editar Estratégia
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Matriz de Precificação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Matriz de Precificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Produto/Serviço</th>
                  <th className="text-right py-3 px-4 font-semibold">Preço Atual</th>
                  <th className="text-right py-3 px-4 font-semibold">Preço Sugerido</th>
                  <th className="text-right py-3 px-4 font-semibold">Variação</th>
                  <th className="text-center py-3 px-4 font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { product: "Plano Mentor START", current: 150, suggested: 180, variation: "+20%" },
                  { product: "Plano Mentor DESTAQUE", current: 280, suggested: 320, variation: "+14%" },
                  { product: "Plano Empresa START", current: 120, suggested: 150, variation: "+25%" },
                  { product: "Kit Emprego Completo", current: 129, suggested: 149, variation: "+15%" },
                ].map((item) => (
                  <tr key={item.product} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.product}</td>
                    <td className="py-3 px-4 text-right">R$ {item.current}</td>
                    <td className="py-3 px-4 text-right font-semibold">R$ {item.suggested}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">{item.variation}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Aplicar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
