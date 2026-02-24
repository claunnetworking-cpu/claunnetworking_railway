import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Users, MessageSquare, Wifi, AlertCircle, TrendingUp, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCommunity() {
  const [, setLocation] = useLocation();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalPosts: 0,
    activeConnections: 0,
    pendingConnections: 0,
    violations: 0,
    interests: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/login');
      return;
    }

    // Simular carregamento de métricas
    // Em produção, isso viria de procedures tRPC específicas
    setMetrics({
      totalUsers: 24,
      totalPosts: 87,
      activeConnections: 156,
      pendingConnections: 12,
      violations: 3,
      interests: 9,
    });
  }, [setLocation]);

  const handleBack = () => {
    setLocation('/admin');
  };

  const metricCards = [
    {
      title: 'Total de Usuários',
      value: metrics.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total de Postagens',
      value: metrics.totalPosts,
      icon: MessageSquare,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Conexões Ativas',
      value: metrics.activeConnections,
      icon: Wifi,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Conexões Pendentes',
      value: metrics.pendingConnections,
      icon: TrendingUp,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Violações Detectadas',
      value: metrics.violations,
      icon: AlertCircle,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Áreas de Interesse',
      value: metrics.interests,
      icon: Users,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <ChevronLeft size={20} />
            Voltar
          </button>
          <h1 className="text-3xl font-bold">Dashboard da Comunidade</h1>
          <p className="text-purple-100 mt-2">Monitore a saúde e atividade da Comunidade ClaunNetworking</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metricCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  </div>
                  <div className={`${card.lightColor} p-3 rounded-lg`}>
                    <Icon className={`${card.textColor} w-6 h-6`} />
                  </div>
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`${card.color} h-full rounded-full`}
                    style={{ width: `${Math.min((card.value / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Violations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">Violações Recentes</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900">Palavras proibidas detectadas</p>
                <p className="text-xs text-red-700 mt-1">Usuário: João Silva • 2 horas atrás</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900">Postagem denunciada</p>
                <p className="text-xs text-red-700 mt-1">Usuário: Maria Santos • 5 horas atrás</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900">Comportamento suspeito</p>
                <p className="text-xs text-red-700 mt-1">Usuário: Pedro Costa • 1 dia atrás</p>
              </div>
            </div>
          </div>

          {/* Top Interests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Principais Interesses</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Tecnologia', count: 8, percentage: 33 },
                { name: 'Administrativa & RH', count: 6, percentage: 25 },
                { name: 'Educação', count: 5, percentage: 21 },
                { name: 'Comercial & Vendas', count: 3, percentage: 13 },
                { name: 'Direito', count: 2, percentage: 8 },
              ].map((interest, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700">{interest.name}</p>
                    <p className="text-sm font-bold text-gray-900">{interest.count}</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${interest.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left">
              <p className="font-medium text-gray-900">Gerenciar Usuários</p>
              <p className="text-sm text-gray-600 mt-1">Visualizar, editar ou banir usuários</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left">
              <p className="font-medium text-gray-900">Revisar Denúncias</p>
              <p className="text-sm text-gray-600 mt-1">Analisar postagens denunciadas</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left">
              <p className="font-medium text-gray-900">Configurar Palavras</p>
              <p className="text-sm text-gray-600 mt-1">Adicionar/remover palavras proibidas</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
