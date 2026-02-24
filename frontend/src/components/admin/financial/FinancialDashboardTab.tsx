import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle } from "lucide-react";

export default function FinancialDashboardTab() {
  const metrics = {
    totalRevenue: 45250.00,
    monthlyRevenue: 12500.00,
    pendingPayments: 8750.00,
    receivedToday: 3200.00,
    conversionRate: 68,
    avgTicket: 450.00,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Dashboard Financeiro</h2>
            <p className="text-green-100">Visão geral de receitas, cobranças e performance</p>
          </div>
          <DollarSign className="w-12 h-12 opacity-20" />
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receita Total */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground mt-1">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        {/* Receita do Mês */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {metrics.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground mt-1">Em progresso</p>
          </CardContent>
        </Card>

        {/* Pendente */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-yellow-900">Pendente</CardTitle>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-700">R$ {metrics.pendingPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-yellow-600 mt-1">Aguardando pagamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Taxa de Conversão */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{metrics.conversionRate}%</span>
            </div>
            <Progress value={metrics.conversionRate} className="h-2" />
            <p className="text-xs text-muted-foreground">Meta: 75%</p>
          </CardContent>
        </Card>

        {/* Ticket Médio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">R$ {metrics.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <Badge className="bg-green-100 text-green-800">+8% vs mês anterior</Badge>
            <p className="text-xs text-muted-foreground">Valor médio por transação</p>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Transações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 1, description: "Plano Mentor DESTAQUE", amount: 280, status: "Pago", date: "Hoje" },
              { id: 2, description: "Plano Empresa PARCEIRA", amount: 450, status: "Pago", date: "Ontem" },
              { id: 3, description: "Kit Emprego Completo", amount: 129, status: "Pendente", date: "2 dias atrás" },
              { id: 4, description: "Currículo Profissional", amount: 39, status: "Pago", date: "3 dias atrás" },
            ].map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <Badge className={tx.status === "Pago" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
