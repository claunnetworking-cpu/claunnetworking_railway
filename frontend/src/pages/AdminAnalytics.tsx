import { useState } from 'react';
import { ArrowLeft, Download, BarChart3, TrendingUp, Share2, Users } from 'lucide-react';
import { useLocation } from 'wouter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Dados simulados para gráficos
const clickTrendsData = [
  { date: '01/02', cliques: 45, redirecionamentos: 32, compartilhamentos: 12 },
  { date: '02/02', cliques: 52, redirecionamentos: 38, compartilhamentos: 15 },
  { date: '03/02', cliques: 48, redirecionamentos: 35, compartilhamentos: 13 },
  { date: '04/02', cliques: 61, redirecionamentos: 44, compartilhamentos: 18 },
  { date: '05/02', cliques: 55, redirecionamentos: 40, compartilhamentos: 16 },
  { date: '06/02', cliques: 67, redirecionamentos: 48, compartilhamentos: 20 },
  { date: '07/02', cliques: 72, redirecionamentos: 52, compartilhamentos: 22 },
];

const cargoDistributionData: any[] = [];

const engagementData = [
  { name: 'Redirecionamentos', value: 65, fill: '#10B981' },
  { name: 'Compartilhamentos', value: 35, fill: '#6B1FB0' },
];

const siteAccessData = [
  { period: 'Seg', acessos: 234 },
  { period: 'Ter', acessos: 321 },
  { period: 'Qua', acessos: 289 },
  { period: 'Qui', acessos: 412 },
  { period: 'Sex', acessos: 456 },
  { period: 'Sab', acessos: 198 },
  { period: 'Dom', acessos: 145 },
];

export default function AdminAnalytics() {
  const [, navigate] = useLocation();
  const [dateRange, setDateRange] = useState('7days');

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    let yPosition = 15;
    
    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Analytics', 14, yPosition);
    yPosition += 10;
    
    // Data
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, yPosition);
    yPosition += 7;
    const periodLabel = dateRange === '7days' ? 'Últimos 7 dias' : dateRange === '15days' ? 'Últimos 15 dias' : dateRange === '30days' ? 'Últimos 30 dias' : 'Últimos 90 dias';
    doc.text(`Período: ${periodLabel}`, 14, yPosition);
    yPosition += 10;
    
    // Resumo de Métricas
    doc.setFontSize(12);
    doc.text('Resumo de Métricas', 14, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.text('Total de Cliques: 452 (↑ 12%)', 14, yPosition);
    yPosition += 6;
    doc.text('Redirecionamentos: 289 (↑ 8%)', 14, yPosition);
    yPosition += 6;
    doc.text('Compartilhamentos: 116 (↑ 15%)', 14, yPosition);
    yPosition += 6;
    doc.text('Taxa de Engajamento: 64% (↑ 5%)', 14, yPosition);
    yPosition += 10;
    
    // Tabela de Dados - Tendências de Cliques
    const tableData = [
      ['Data', 'Cliques', 'Redirecionamentos', 'Compartilhamentos'],
      ...clickTrendsData.map(d => [d.date, d.cliques.toString(), d.redirecionamentos.toString(), d.compartilhamentos.toString()])
    ];
    
    (doc as any).autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: yPosition,
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [107, 31, 176],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    
    // Adicionar nova página se necessário
    const finalY = (doc as any).lastAutoTable.finalY;
    if (finalY > 250) {
      doc.addPage();
      yPosition = 15;
    } else {
      yPosition = finalY + 10;
    }
    
    // Tabela de Acessos ao Site
    doc.setFontSize(12);
    doc.text('Acessos ao Site por Dia', 14, yPosition);
    yPosition += 8;
    
    const accessTableData = [
      ['Dia', 'Acessos'],
      ...siteAccessData.map(d => [d.period, d.acessos.toString()])
    ];
    
    (doc as any).autoTable({
      head: [accessTableData[0]],
      body: accessTableData.slice(1),
      startY: yPosition,
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [107, 31, 176],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    
    // Tabela de Engajamento
    const engagementTableData = [
      ['Tipo', 'Valor'],
      ...engagementData.map(d => [d.name, d.value.toString()])
    ];
    
    const engagementFinalY = (doc as any).lastAutoTable.finalY;
    if (engagementFinalY > 250) {
      doc.addPage();
      yPosition = 15;
    } else {
      yPosition = engagementFinalY + 10;
    }
    
    doc.setFontSize(12);
    doc.text('Engajamento: Redirecionamentos vs Compartilhamentos', 14, yPosition);
    yPosition += 8;
    
    (doc as any).autoTable({
      head: [engagementTableData[0]],
      body: engagementTableData.slice(1),
      startY: yPosition,
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [107, 31, 176],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    
    doc.save(`analytics-${dateRange}-${new Date().getTime()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors border border-purple-200"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
            <h1 className="text-2xl md:text-4xl font-bold text-purple-900">Analytics</h1>
          </div>
          <button
            onClick={handleGeneratePDF}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium w-full md:w-auto justify-center"
          >
            <Download size={20} />
            Gerar PDF
          </button>
        </div>

        {/* Filtro de Período */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-purple-100">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">Período de Análise</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { value: '7days', label: 'Últimos 7 dias' },
              { value: '15days', label: 'Últimos 15 dias' },
              { value: '30days', label: 'Últimos 30 dias' },
              { value: '90days', label: 'Últimos 90 dias' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  dateRange === option.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tendências de Cliques */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Tendências de Cliques</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clickTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
                <XAxis dataKey="date" stroke="#9333EA" />
                <YAxis stroke="#9333EA" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F3E8FF', border: '1px solid #D8B4FE' }}
                  cursor={{ stroke: '#10B981' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cliques" 
                  stroke="#6B1FB0" 
                  strokeWidth={2}
                  dot={{ fill: '#6B1FB0', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="redirecionamentos" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="compartilhamentos" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição por Cargo */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Cliques por Cargo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cargoDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cargoDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Engajamento: Redirecionamentos vs Compartilhamentos */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Engajamento: Redirecionamentos vs Compartilhamentos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
                <XAxis dataKey="name" stroke="#9333EA" />
                <YAxis stroke="#9333EA" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F3E8FF', border: '1px solid #D8B4FE' }}
                />
                <Bar dataKey="value" fill="#6B1FB0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Acessos ao Site por Dia */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Acessos ao Site por Dia</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={siteAccessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
                <XAxis dataKey="period" stroke="#9333EA" />
                <YAxis stroke="#9333EA" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F3E8FF', border: '1px solid #D8B4FE' }}
                />
                <Bar dataKey="acessos" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resumo de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-600 text-sm font-medium">Total de Cliques</p>
              <BarChart3 size={18} className="text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-900">452</p>
            <p className="text-green-600 text-xs mt-2">↑ 12% vs período anterior</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-600 text-sm font-medium">Redirecionamentos</p>
              <TrendingUp size={18} className="text-green-400" />
            </div>
            <p className="text-3xl font-bold text-purple-900">289</p>
            <p className="text-green-600 text-xs mt-2">↑ 8% vs período anterior</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-600 text-sm font-medium">Compartilhamentos</p>
              <Share2 size={18} className="text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-purple-900">116</p>
            <p className="text-green-600 text-xs mt-2">↑ 15% vs período anterior</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-600 text-sm font-medium">Taxa de Engajamento</p>
              <Users size={18} className="text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-purple-900">64%</p>
            <p className="text-green-600 text-xs mt-2">↑ 5% vs período anterior</p>
          </div>
        </div>
      </div>
    </div>
  );
}
