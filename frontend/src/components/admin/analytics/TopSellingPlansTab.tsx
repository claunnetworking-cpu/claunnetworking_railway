import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export default function TopSellingPlansTab() {
  // Dados reais da API
  const { data: topPlans = [], isLoading } = trpc.analytics.topSellingPlans.useQuery();

  const handleExport = () => {
    const csv = [
      ['Plano', 'Vendas', 'Receita', 'Tier', 'Tendência'],
      ...topPlans.map(p => [p.name, p.sales, p.revenue.toFixed(2), p.tier, p.trend])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planos-vendidos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  const chartData = topPlans.map(p => ({
    name: p.name.substring(0, 15) + "...",
    sales: p.sales,
    revenue: p.revenue / 1000,
  }));

  const pieData = topPlans.map(p => ({
    name: p.name,
    value: p.sales,
  }));

  const COLORS = ['#6B1FB0', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'starter':
        return 'bg-blue-100 text-blue-800';
      case 'professional':
        return 'bg-purple-100 text-purple-800';
      case 'premium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'starter':
        return 'Iniciante';
      case 'professional':
        return 'Profissional';
      case 'premium':
        return 'Premium';
      default:
        return tier;
    }
  };

  const totalSales = topPlans.reduce((sum, p) => sum + p.sales, 0);
  const totalRevenue = topPlans.reduce((sum, p) => sum + p.revenue, 0);
  const avgSalesPerPlan = topPlans.length > 0 ? (totalSales / topPlans.length).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Planos Mais Vendidos</h2>
          <p className="text-sm text-muted-foreground">Análise de performance dos seus planos</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalSales}</p>
            <p className="text-xs text-muted-foreground">Planos vendidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {(totalRevenue / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground">Gerado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {totalSales > 0 ? (totalRevenue / totalSales).toFixed(0) : '0'}</p>
            <p className="text-xs text-muted-foreground">Por venda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Média por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgSalesPerPlan}</p>
            <p className="text-xs text-muted-foreground">Vendas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Vendas por Plano */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Vendas por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#6B1FB0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Distribuição de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Distribuição de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name.substring(0, 10)}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Detalhes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ranking de Planos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Plano</th>
                  <th className="text-left py-3 px-4 font-semibold">Tier</th>
                  <th className="text-right py-3 px-4 font-semibold">Vendas</th>
                  <th className="text-right py-3 px-4 font-semibold">Receita</th>
                  <th className="text-right py-3 px-4 font-semibold">Tendência</th>
                </tr>
              </thead>
              <tbody>
                {topPlans.map((plan, idx) => (
                  <tr key={plan.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                        {plan.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getTierColor(plan.tier)}>
                        {getTierLabel(plan.tier)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">{plan.sales}</td>
                    <td className="py-3 px-4 text-right font-semibold">R$ {plan.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${plan.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {plan.trend}
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
