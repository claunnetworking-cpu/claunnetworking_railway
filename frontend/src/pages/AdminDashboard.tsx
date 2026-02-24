import { useState, useEffect } from 'react';
import { BarChart3, Briefcase, BookOpen, Link2, FileText, LogOut, LineChart, Home, MessageCircle, TrendingUp, Menu, X, Moon, Sun, DollarSign, Settings, Building2, Package, Calendar, Users } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AdminResumesTab from '@/pages/AdminResumesTab';


const menuGroups = [
  {
    id: 'clientes',
    label: 'Clientes',
    icon: Users,
    color: 'bg-purple-600',
    description: 'Gerenciar pedidos de publicação',
      items: [
        { id: 'clients', label: 'Dashboard de Clientes', icon: Users, path: '/admin/clients' },
        { id: 'service-requests', label: 'Pedidos de Publicação', icon: FileText, path: '/admin/service-requests' },
        { id: 'resumes', label: 'Currículos', icon: FileText, path: '/admin/resumes' },
      ]
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: Briefcase,
    color: 'bg-purple-600',
    description: 'Gerencie vagas e cursos',
    items: [
      { id: 'jobs', label: 'Cadastro de Vagas', icon: Briefcase, path: '/admin/jobs' },
      { id: 'courses', label: 'Cadastro de Cursos', icon: BookOpen, path: '/admin/courses' },
    ]
  },
  {
    id: 'links',
    label: 'Links',
    icon: Link2,
    color: 'bg-purple-600',
    description: 'Gerencie filtros e links',
    items: [
      { id: 'filters', label: 'Filtros', icon: BarChart3, path: '/admin/filters' },
      { id: 'links-gen', label: 'Gerador de Links', icon: Link2, path: '/admin/links' },
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: LineChart,
    color: 'bg-purple-600',
    description: 'Relatórios e métricas',
    items: [
      { id: 'statistics', label: 'Estatísticas', icon: TrendingUp, path: '/admin/statistics' },
      { id: 'analytics', label: 'Analytics', icon: LineChart, path: '/admin/analytics' },
      { id: 'whatsapp-analytics', label: 'WhatsApp Analytics', icon: MessageCircle, path: '/admin/whatsapp-analytics' },
      { id: 'top-selling-plans', label: 'Planos Mais Vendidos', icon: TrendingUp, path: '/admin/top-selling-plans' },
      { id: 'purchase-history', label: 'Histórico de Compras', icon: FileText, path: '/admin/purchase-history' },
      { id: 'discounts-coupons', label: 'Cupons e Descontos', icon: BarChart3, path: '/admin/discounts-coupons' },
      { id: 'period-filter', label: 'Filtros por Período', icon: Calendar, path: '/admin/period-filter' },
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: DollarSign,
    color: 'bg-purple-600',
    description: 'Gestão financeira e cobranças',
    items: [
      { id: 'financial', label: 'Módulo Financeiro', icon: DollarSign, path: '/admin/financial' },
    ]
  },
  {
    id: 'tecnologia',
    label: 'Tecnologia',
    icon: Settings,
    color: 'bg-purple-600',
    description: 'Configurações e monitoramento',
    items: [
      { id: 'system-settings', label: 'Configurações do Sistema', icon: Settings, path: '/admin/system-settings' },
    ]
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: Building2,
    color: 'bg-purple-600',
    description: 'Gestão comercial e vendas',
    items: [
      { id: 'commercial', label: 'Módulo Comercial', icon: Building2, path: '/admin/commercial' },
    ]
  },
  {
    id: 'produtos',
    label: 'Produtos',
    icon: Package,
    color: 'bg-purple-600',
    description: 'Gestão de produtos e serviços',
    items: [
      { id: 'products', label: 'Cadastro de Produtos e Serviços', icon: Package, path: '/admin/products' },
    ]
  },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('adminDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [counters, setCounters] = useState({
    jobs: 0,
    courses: 0,
    links: 0,
    clicks: 0,
  });

  // Verificar se é admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setLocation('/');
      return;
    }
  }, [isAuthenticated, user, setLocation]);

  useEffect(() => {
    localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setLocation('/');
  };

  const handleGroupClick = (groupId: string) => {
    setActiveGroup(groupId);
  };

  const currentGroup = activeGroup ? menuGroups.find(g => g.id === activeGroup) : null;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Bar with Discrete Controls */}
      <div className={`flex items-center justify-between p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Painel Admin</h2>
        
        {/* Discrete Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Back to Site Button */}
          <button
            onClick={() => setLocation('/')}
            title="Voltar ao Site"
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
          >
            <Home className="w-5 h-5" />
          </button>
          
          {/* User Info */}
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {user?.email}
          </span>
          
          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            title="Sair"
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
          >
            <LogOut className="w-5 h-5" />
          </button>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle className={darkMode ? 'text-white' : ''}>Confirmar Logout</AlertDialogTitle>
            <AlertDialogDescription className={darkMode ? 'text-gray-400' : ''}>
              Tem certeza que deseja sair do painel administrativo?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className={darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLogout} className="bg-red-600 hover:bg-red-700">Sair</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-8 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl w-full">
          {!activeGroup ? (
            <>
              {/* Welcome Screen */}
              <div className="mb-12">
                <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Bem-vindo ao Painel Administrativo</h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Selecione uma seção para começar</p>
              </div>

              {/* Group Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {menuGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <button
                      key={group.id}
                      onClick={() => handleGroupClick(group.id)}
                      className={`p-6 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105 ${group.color} text-white text-left`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Icon className="w-12 h-12" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{group.label}</h3>
                      <p className="text-white/80 text-sm">{group.description}</p>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          {group.id === 'cadastros' && (
                            <p className="text-white/60 text-xs">Vagas: <span className="font-bold text-white">{counters.jobs}</span> | Cursos: <span className="font-bold text-white">{counters.courses}</span></p>
                          )}
                          {group.id === 'links' && (
                            <p className="text-white/60 text-xs">Links: <span className="font-bold text-white">{counters.links}</span> | Cliques: <span className="font-bold text-white">{counters.clicks}</span></p>
                          )}
                          {group.id !== 'cadastros' && group.id !== 'links' && group.id !== 'analytics' && (
                            <p className="text-white/60 text-xs">{group.items.length} itens</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : currentGroup ? (
            <>
              {/* Section Header */}
              <div className="mb-8">
                <button
                  onClick={() => setActiveGroup(null)}
                  className={`mb-4 flex items-center gap-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  ← Voltar
                </button>
              </div>

              {/* Section Content - Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentGroup.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <ItemIcon className="w-8 h-8 text-green-500" />
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</h3>
                      </div>
                      <button
                        onClick={() => setLocation(item.path)}
                        className="w-full mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                      >
                        Acessar
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
