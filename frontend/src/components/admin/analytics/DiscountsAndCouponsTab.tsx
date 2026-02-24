import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, TrendingDown, Plus, Copy, Eye, EyeOff, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";

export default function DiscountsAndCouponsTab() {
  // Dados reais da API
  const { data: coupons = [], isLoading } = trpc.analytics.couponsAndDiscounts.useQuery();

  const handleExport = () => {
    const csv = [
      ['Código', 'Desconto', 'Tipo', 'Uso', 'Limite', 'Status', 'Criado', 'Expira'],
      ...coupons.map(c => [c.code, c.discount, c.type, c.usage, c.limit, c.status, c.created, c.expires])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cupons-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  const chartData = coupons
    .filter((c: any) => c.status === 'active')
    .map((c: any) => ({
      code: c.code,
      usage: c.usage,
      remaining: c.limit - c.usage,
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'expired':
        return 'Expirado';
      case 'paused':
        return 'Pausado';
      default:
        return status;
    }
  };

  const activeCoupons = coupons.filter((c: any) => c.status === 'active').length;
  const totalUsage = coupons.reduce((sum: number, c: any) => sum + c.usage, 0);
  const totalDiscount = coupons.reduce((sum: number, c: any) => {
    if (c.type === 'percentage') {
      return sum + (c.discount * c.usage / 100);
    } else {
      return sum + (c.discount * c.usage);
    }
  }, 0);
  const totalLimit = coupons.reduce((sum: number, c: any) => sum + c.limit, 0);
  const avgUsageRate = totalLimit > 0 ? ((totalUsage / totalLimit) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cupons e Descontos</h2>
          <p className="text-sm text-muted-foreground">Gerencie promoções e cupons de desconto</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="w-4 h-4" />
            Novo Cupom
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" />
              Cupons Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeCoupons}</p>
            <p className="text-xs text-muted-foreground">Em circulação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Usos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsage}</p>
            <p className="text-xs text-muted-foreground">Cupons utilizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Desconto Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {totalDiscount.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Concedido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgUsageRate}%</p>
            <p className="text-xs text-muted-foreground">Média de utilização</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Uso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Uso de Cupons Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="code" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="usage" fill="#6B1FB0" name="Utilizados" />
              <Bar dataKey="remaining" fill="#D1D5DB" name="Disponíveis" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Cupons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cupons Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Código</th>
                  <th className="text-left py-3 px-4 font-semibold">Desconto</th>
                  <th className="text-center py-3 px-4 font-semibold">Uso</th>
                  <th className="text-left py-3 px-4 font-semibold">Validade</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon: any) => (
                  <tr key={coupon.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold font-mono">{coupon.code}</td>
                    <td className="py-3 px-4">
                      {coupon.type === 'percentage' 
                        ? `${coupon.discount}%` 
                        : `R$ ${coupon.discount.toFixed(2)}`
                      }
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="text-sm font-semibold">
                        {coupon.usage}/{coupon.limit}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(coupon.usage / coupon.limit) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {coupon.expires}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(coupon.status)}>
                        {getStatusLabel(coupon.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-muted-foreground hover:text-foreground transition">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition">
                          {coupon.status === 'active' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
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
