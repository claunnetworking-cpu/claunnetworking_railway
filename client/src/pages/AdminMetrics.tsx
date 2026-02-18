import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ChevronLeft, BarChart3, TrendingUp, Share2, Eye, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function AdminMetrics() {
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState(30);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/login');
    }
  }, [setLocation]);

  const { data: metricsData } = trpc.metrics.getPeriodMetrics.useQuery({ daysAgo: period });

  useEffect(() => {
    if (metricsData) {
      setMetrics(metricsData);
    }
  }, [metricsData]);

  const periodOptions = [
    { value: 7, label: 'Últimos 7 dias' },
    { value: 15, label: 'Últimos 15 dias' },
    { value: 30, label: 'Últimos 30 dias' },
    { value: 60, label: 'Últimos 60 dias' },
    { value: 90, label: 'Últimos 90 dias' },
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Título
    doc.setFontSize(20);
    doc.setTextColor(107, 31, 176);
    doc.text('Relatório de Métricas da Plataforma', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Data
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Métricas
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo de Métricas', 20, yPos);
    yPos += 10;

    const metricsText = [
      `Total de Acessos: ${metrics?.siteVisits || 0}`,
      `Total de Cliques: ${metrics?.totalClicks || 0}`,
      `Redirecionamentos: ${metrics?.redirects || 0}`,
      `Compartilhamentos WhatsApp: ${metrics?.whatsappShares || 0}`,
    ];

    metricsText.forEach((text) => {
      doc.text(text, 20, yPos);
      yPos += 8;
    });

    doc.save(`metricas-plataforma-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setLocation('/admin')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Métricas da Plataforma
          </h1>
        </div>

        {/* Filtro de Período */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Período de Análise
          </label>
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  period === option.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Métricas */}
        {metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total de Acessos */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold">Total de Acessos</h3>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-slate-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-700">{metrics.siteVisits || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Visitas ao site</p>
            </div>

            {/* Total de Cliques */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold">Total de Cliques</h3>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-slate-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-700">{metrics.totalClicks || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Cliques em vagas/cursos</p>
            </div>

            {/* Redirecionamentos */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold">Redirecionamentos</h3>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-slate-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-700">{metrics.redirects || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Cliques no botão Acessar</p>
            </div>

            {/* Compartilhamentos WhatsApp */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold">Compartilhamentos</h3>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-slate-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-700">{metrics.whatsappShares || 0}</p>
              <p className="text-sm text-gray-500 mt-2">Compartilhamentos WhatsApp</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">Carregando métricas...</p>
          </div>
        )}

        {/* Botão Exportar PDF */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            Exportar PDF
          </button>
        </div>

        {/* Gráfico de Engajamento */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo de Engajamento</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Redirecionamentos</span>
                <span className="text-sm font-semibold text-gray-700">
                  {metrics?.redirects || 0} ({metrics?.totalClicks ? Math.round((metrics.redirects / metrics.totalClicks) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: metrics?.totalClicks ? `${(metrics.redirects / metrics.totalClicks) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Compartilhamentos WhatsApp</span>
                <span className="text-sm font-semibold text-gray-700">
                  {metrics?.whatsappShares || 0} ({metrics?.totalClicks ? Math.round((metrics.whatsappShares / metrics.totalClicks) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: metrics?.totalClicks ? `${(metrics.whatsappShares / metrics.totalClicks) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
