import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function ExecutiveDashboard() {
  const [, setLocation] = useLocation();
  
  // Buscar dados reais
  const { data: commercialStats = { totalClients: 0, activeClients: 0, totalValue: 0, ticketMedio: 0 } } = trpc.analytics.commercialStats.useQuery();
  const { data: financialStats = { totalIncome: 0, totalExpenses: 0, balance: 0, accountsReceivable: 0 } } = trpc.analytics.financialStats.useQuery();
  const { data: topPlans = [] } = trpc.analytics.topSellingPlans.useQuery();

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      commercial: commercialStats,
      financial: financialStats,
      topPlans: topPlans.slice(0, 5),
    };

    const csv = [
      ['RESUMO EXECUTIVO'],
      ['Data', new Date().toLocaleDateString('pt-BR')],
      [''],
      ['COMERCIAL'],
      ['Total de Clientes', commercialStats.totalClients],
      ['Clientes Ativos', commercialStats.activeClients],
      ['Valor Total', commercialStats.totalValue],
      ['Ticket Médio', commercialStats.ticketMedio],
      [''],
      ['FINANCEIRO'],
      ['Receita Total', financialStats.totalIncome],
      ['Despesas', financialStats.totalExpenses],
      ['Saldo', financialStats.balance],
      ['Contas a Receber', financialStats.accountsReceivable],
      [''],
      ['TOP 5 PLANOS'],
      ['Plano', 'Vendas', 'Receita'],
      ...topPlans.slice(0, 5).map((p: any) => [p.name, p.sales, p.revenue])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumo-executivo-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const chartData = [
    { month: "Janeiro", receita: 15000, clientes: 45 },
    { month: "Fevereiro", receita: (financialStats.totalIncome || 0), clientes: (commercialStats.totalClients || 0) },
  ];

  return (
    <div className="w-full h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setLocation('/admin')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Executivo</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Resumo consolidado de KPIs principais
            </p>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Clientes Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{commercialStats.activeClients || 0}</p>
              <p className="text-xs text-muted-foreground">de {commercialStats.totalClients || 0} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R$ {(financialStats.totalIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Gerado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Ticket Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R$ {(commercialStats.ticketMedio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Por cliente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R$ {(financialStats.balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Receita - Despesas</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Tendência de Receita e Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={2} name="Receita (R$)" />
                  <Line yAxisId="right" type="monotone" dataKey="clientes" stroke="#3B82F6" strokeWidth={2} name="Clientes" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Top 5 Planos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPlans.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#6B1FB0" name="Vendas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro Detalhado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Receitas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receita Total</span>
                    <span className="font-semibold">R$ {(financialStats.totalIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Médio por Cliente</span>
                    <span className="font-semibold">R$ {(commercialStats.ticketMedio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Despesas & Contas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Despesas</span>
                    <span className="font-semibold">R$ {(financialStats.totalExpenses || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contas a Receber</span>
                    <span className="font-semibold">R$ {(financialStats.accountsReceivable || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Comerciais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Comerciais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Clientes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">{commercialStats.totalClients || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ativos</span>
                    <span className="font-semibold text-green-600">{commercialStats.activeClients || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de Atividade</span>
                    <span className="font-semibold">
                      {commercialStats.totalClients > 0 
                        ? ((commercialStats.activeClients / commercialStats.totalClients) * 100).toFixed(0) 
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Valor</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Total</span>
                    <span className="font-semibold">R$ {(commercialStats.totalValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ticket Médio</span>
                    <span className="font-semibold">R$ {(commercialStats.ticketMedio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Planos Ativos</span>
                    <span className="font-semibold">{topPlans.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plano Top</span>
                    <span className="font-semibold">{topPlans[0]?.name || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
