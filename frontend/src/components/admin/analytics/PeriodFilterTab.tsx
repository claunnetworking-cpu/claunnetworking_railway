import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { trpc } from '@/lib/trpc';

type PeriodType = 'day' | 'week' | 'month' | 'year';

export default function PeriodFilterTab() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [comparePeriod, setComparePeriod] = useState(false);

  // Mock data - replace with real API calls
  const mockData = {
    day: [
      { time: '00:00', clicks: 45, views: 120, conversions: 8 },
      { time: '06:00', clicks: 52, views: 145, conversions: 12 },
      { time: '12:00', clicks: 78, views: 220, conversions: 18 },
      { time: '18:00', clicks: 65, views: 180, conversions: 14 },
    ],
    week: [
      { day: 'Seg', clicks: 240, views: 800, conversions: 45 },
      { day: 'Ter', clicks: 280, views: 920, conversions: 52 },
      { day: 'Qua', clicks: 320, views: 1050, conversions: 58 },
      { day: 'Qui', clicks: 290, views: 950, conversions: 50 },
      { day: 'Sex', clicks: 380, views: 1200, conversions: 68 },
      { day: 'Sab', clicks: 250, views: 750, conversions: 40 },
      { day: 'Dom', clicks: 200, views: 600, conversions: 32 },
    ],
    month: [
      { week: 'Sem 1', clicks: 1200, views: 4500, conversions: 180 },
      { week: 'Sem 2', clicks: 1400, views: 5200, conversions: 210 },
      { week: 'Sem 3', clicks: 1600, views: 5800, conversions: 240 },
      { week: 'Sem 4', clicks: 1350, views: 5000, conversions: 200 },
    ],
    year: [
      { month: 'Jan', clicks: 4500, views: 18000, conversions: 720 },
      { month: 'Fev', clicks: 5200, views: 20000, conversions: 800 },
      { month: 'Mar', clicks: 6100, views: 23000, conversions: 920 },
      { month: 'Abr', clicks: 5800, views: 22000, conversions: 880 },
      { month: 'Mai', clicks: 6500, views: 24000, conversions: 960 },
      { month: 'Jun', clicks: 7200, views: 26000, conversions: 1040 },
    ],
  };

  const currentData = mockData[selectedPeriod];
  const previousData = comparePeriod ? mockData[selectedPeriod].map(item => ({
    ...item,
    clicks: Math.round(item.clicks * 0.85),
    views: Math.round(item.views * 0.85),
    conversions: Math.round(item.conversions * 0.85),
  })) : null;

  const getMetrics = () => {
    const totalClicks = currentData.reduce((sum, item) => sum + item.clicks, 0);
    const totalViews = currentData.reduce((sum, item) => sum + item.views, 0);
    const totalConversions = currentData.reduce((sum, item) => sum + item.conversions, 0);
    
    const conversionRate = totalViews > 0 ? (totalConversions / totalViews * 100).toFixed(2) : '0';
    const clickRate = totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(2) : '0';

    return {
      totalClicks,
      totalViews,
      totalConversions,
      conversionRate,
      clickRate,
    };
  };

  const metrics = getMetrics();

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtro de Período
          </CardTitle>
          <CardDescription>Selecione o período para análise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            {(['day', 'week', 'month', 'year'] as PeriodType[]).map(period => (
              <Button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                className="capitalize"
              >
                {period === 'day' ? 'Dia' : period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Ano'}
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={comparePeriod}
              onChange={(e) => setComparePeriod(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Comparar com período anterior</span>
          </label>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Cliques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Cliques totais no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Visualizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Visualizações totais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Clique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.clickRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Cliques por visualização</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Conversões por visualização</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Cliques</CardTitle>
          <CardDescription>Evolução de cliques ao longo do período</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedPeriod === 'day' ? 'time' : selectedPeriod === 'week' ? 'day' : selectedPeriod === 'month' ? 'week' : 'month'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="clicks" stroke="#9333ea" strokeWidth={2} />
              {comparePeriod && <Line type="monotone" dataKey="clicks" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" />}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparação de Métricas</CardTitle>
          <CardDescription>Cliques vs Visualizações vs Conversões</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedPeriod === 'day' ? 'time' : selectedPeriod === 'week' ? 'day' : selectedPeriod === 'month' ? 'week' : 'month'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="clicks" fill="#9333ea" />
              <Bar dataKey="conversions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {comparePeriod && (
        <Card>
          <CardHeader>
            <CardTitle>Comparação de Períodos</CardTitle>
            <CardDescription>Período atual vs Período anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Métrica</th>
                    <th className="text-right py-2 px-2">Período Atual</th>
                    <th className="text-right py-2 px-2">Período Anterior</th>
                    <th className="text-right py-2 px-2">Variação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">Cliques</td>
                    <td className="text-right py-2 px-2">{metrics.totalClicks.toLocaleString()}</td>
                    <td className="text-right py-2 px-2">{Math.round(metrics.totalClicks * 0.85).toLocaleString()}</td>
                    <td className="text-right py-2 px-2 text-green-600 flex items-center justify-end gap-1">
                      <TrendingUp className="h-4 w-4" />
                      +15%
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">Visualizações</td>
                    <td className="text-right py-2 px-2">{metrics.totalViews.toLocaleString()}</td>
                    <td className="text-right py-2 px-2">{Math.round(metrics.totalViews * 0.85).toLocaleString()}</td>
                    <td className="text-right py-2 px-2 text-green-600 flex items-center justify-end gap-1">
                      <TrendingUp className="h-4 w-4" />
                      +15%
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2">Conversões</td>
                    <td className="text-right py-2 px-2">{metrics.totalConversions.toLocaleString()}</td>
                    <td className="text-right py-2 px-2">{Math.round(metrics.totalConversions * 0.85).toLocaleString()}</td>
                    <td className="text-right py-2 px-2 text-green-600 flex items-center justify-end gap-1">
                      <TrendingUp className="h-4 w-4" />
                      +15%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
