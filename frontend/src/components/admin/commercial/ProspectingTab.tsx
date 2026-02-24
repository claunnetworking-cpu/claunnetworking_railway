import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProspectingTab() {
  const prospects = [
    { id: 1, name: "Empresa Alpha", contact: "Roberto Silva", status: "Qualificado", value: 5000, stage: "Proposta", progress: 75 },
    { id: 2, name: "Startup Beta", contact: "Juliana Costa", status: "Em Qualificação", value: 3000, stage: "Apresentação", progress: 50 },
    { id: 3, name: "Corporação Gamma", contact: "Fernando Dias", status: "Novo", value: 8000, stage: "Primeiro Contato", progress: 25 },
    { id: 4, name: "Negócio Delta", contact: "Patricia Oliveira", status: "Qualificado", value: 4500, stage: "Negociação", progress: 85 },
    { id: 5, name: "Empresa Epsilon", contact: "Lucas Martins", status: "Descartado", value: 2000, stage: "Encerrado", progress: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Qualificado":
        return "bg-green-100 text-green-800";
      case "Em Qualificação":
        return "bg-yellow-100 text-yellow-800";
      case "Novo":
        return "bg-blue-100 text-blue-800";
      case "Descartado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalProspects = prospects.length;
  const qualified = prospects.filter(p => p.status === "Qualificado").length;
  const totalValue = prospects.reduce((sum, p) => sum + p.value, 0);
  const conversionRate = ((qualified / totalProspects) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Prospecção</h2>
          <p className="text-sm text-muted-foreground">Acompanhe prospects e oportunidades de negócio</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Prospect
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProspects}</p>
            <p className="text-xs text-muted-foreground">Em pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualificados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{qualified}</p>
            <p className="text-xs text-muted-foreground">Prontos para venda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor em Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">Oportunidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Qualificação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{conversionRate}%</p>
            <p className="text-xs text-muted-foreground">Prospects qualificados</p>
          </CardContent>
        </Card>
      </div>

      {/* Prospects por Estágio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Prospects por Estágio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prospects.map((prospect) => (
            <div key={prospect.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{prospect.name}</h3>
                  <p className="text-sm text-muted-foreground">Contato: {prospect.contact}</p>
                </div>
                <Badge className={getStatusColor(prospect.status)}>
                  {prospect.status}
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{prospect.stage}</span>
                  <span className="text-sm font-semibold">R$ {prospect.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <Progress value={prospect.progress} className="h-2" />
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition">
                  Acompanhar
                </button>
                <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium transition">
                  Avançar Estágio
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Funil de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Funil de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { stage: "Primeiro Contato", count: 3, value: 10000 },
            { stage: "Apresentação", count: 2, value: 7000 },
            { stage: "Proposta", count: 2, value: 9500 },
            { stage: "Negociação", count: 1, value: 4500 },
          ].map((item) => (
            <div key={item.stage}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.stage}</span>
                <span className="text-sm text-muted-foreground">{item.count} prospects • R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <Progress value={(item.count / totalProspects) * 100} className="h-3" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
