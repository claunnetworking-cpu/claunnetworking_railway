import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SalesTab() {
  const salesData = [
    { id: 1, client: "Tech Solutions", product: "Plano Empresa PARCEIRA", amount: 450, date: "2026-02-20", status: "Concluída" },
    { id: 2, client: "Inovação Digital", product: "Plano Mentor DESTAQUE", amount: 280, date: "2026-02-19", status: "Concluída" },
    { id: 3, client: "Consultoria XYZ", product: "Plano Empresa START", amount: 120, date: "2026-02-18", status: "Concluída" },
    { id: 4, client: "Startup ABC", product: "Kit Emprego Completo", amount: 129, date: "2026-02-17", status: "Pendente" },
    { id: 5, client: "Empresa Ltda", product: "Plano Mentor PARCEIRO", amount: 450, date: "2026-02-16", status: "Concluída" },
  ];

  const monthlyGoal = 5000;
  const currentMonth = 1429;
  const lastMonth = 1200;
  const totalSales = salesData.reduce((sum, s) => sum + s.amount, 0);
  const completedSales = salesData.filter(s => s.status === "Concluída").length;

  const getStatusColor = (status: string) => {
    return status === "Concluída" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Vendas</h2>
        <p className="text-sm text-muted-foreground">Acompanhe performance de vendas e metas</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">{salesData.length} transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {currentMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">Meta: R$ {monthlyGoal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">+19%</p>
            <p className="text-xs text-muted-foreground">vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{((completedSales / salesData.length) * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Vendas concluídas</p>
          </CardContent>
        </Card>
      </div>

      {/* Meta do Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Progresso da Meta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Fevereiro 2026</span>
              <span className="text-sm font-semibold">{((currentMonth / monthlyGoal) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(currentMonth / monthlyGoal) * 100} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">
              R$ {currentMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {monthlyGoal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold">Produto</th>
                  <th className="text-left py-3 px-4 font-semibold">Data</th>
                  <th className="text-right py-3 px-4 font-semibold">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{sale.client}</td>
                    <td className="py-3 px-4 text-muted-foreground">{sale.product}</td>
                    <td className="py-3 px-4">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4 text-right font-semibold">R$ {sale.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(sale.status)}>
                        {sale.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análise Comparativa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Análise Comparativa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Fevereiro</span>
              <span className="text-sm font-semibold">R$ {currentMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Janeiro</span>
              <span className="text-sm font-semibold">R$ {lastMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <Progress value={(lastMonth / currentMonth) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
