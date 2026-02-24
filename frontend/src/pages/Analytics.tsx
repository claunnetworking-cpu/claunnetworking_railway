import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { trpc } from '@/lib/trpc';
import { Loader2, TrendingUp, Eye, MousePointer, Zap } from 'lucide-react';

export default function Analytics() {
  const [visitorTrend, setVisitorTrend] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [topJobs, setTopJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: topClicked } = trpc.stats.getTopClickedJobs.useQuery();
  const { data: jobsByCategory } = trpc.stats.getJobsByCategory.useQuery();

  useEffect(() => {
    // Simular dados de tendência de visitantes (últimas 7 dias)
    const today = new Date();
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      trend.push({
        date: date.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' }),
        visitantes: Math.floor(Math.random() * 50) + 10,
        cliques: Math.floor(Math.random() * 30) + 5,
      });
    }
    setVisitorTrend(trend);

    // Simular páginas mais visitadas
    setTopPages([
      { name: 'Homepage', views: 245, percentage: 35 },
      { name: 'Vagas', views: 198, percentage: 28 },
      { name: 'Cursos', views: 142, percentage: 20 },
      { name: 'Filtros', views: 105, percentage: 15 },
      { name: 'Detalhes Vaga', views: 10, percentage: 2 },
    ]);

    // Simular dados de conversão
    setConversionData([
      { name: 'Visitantes', value: 700, fill: '#8b5cf6' },
      { name: 'Cliques', value: 245, fill: '#10b981' },
      { name: 'Compartilhamentos', value: 32, fill: '#f59e0b' },
    ]);

    // Usar dados reais de top jobs
    if (topClicked && topClicked.length > 0) {
      setTopJobs(topClicked.slice(0, 5));
    }

    setLoading(false);
  }, [topClicked]);

  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Dashboard de Analytics</h1>
          <p className="text-purple-100">Análise em tempo real de visitantes, cliques e conversões</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Visitantes Hoje</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">+4</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Cliques em Vagas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{topClicked?.length || 0}</p>
              </div>
              <MousePointer className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">35%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Oportunidades</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">110</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tendência de Visitantes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tendência de Visitantes (7 dias)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visitantes" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="cliques" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Páginas Mais Visitadas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Páginas Mais Visitadas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Funil de Conversão */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Funil de Conversão</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Cargos Clicados */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 Cargos Mais Clicados</h2>
            <div className="space-y-3">
              {topJobs.map((job, index) => (
                <div key={job.jobId} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-gray-800 font-medium">{job.jobTitle}</span>
                  </div>
                  <span className="text-purple-600 font-semibold">{job.clickCount} cliques</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
