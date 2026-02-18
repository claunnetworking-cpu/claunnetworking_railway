import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { BarChart3, Briefcase, BookOpen, Link2, FileText, LogOut, LineChart, Home, MessageCircle } from 'lucide-react';

const menuItems = [
  { id: 'jobs', label: 'Cadastro de Vagas', icon: Briefcase, path: '/admin/jobs' },
  { id: 'courses', label: 'Cadastro de Cursos', icon: BookOpen, path: '/admin/courses' },
  { id: 'filters', label: 'Filtros', icon: BarChart3, path: '/admin/filters' },
  { id: 'links', label: 'Gerador de Links', icon: Link2, path: '/admin/links' },
  { id: 'analytics', label: 'Analytics', icon: LineChart, path: '/admin/analytics' },
  { id: 'advanced-analytics', label: 'Analytics Avançado', icon: LineChart, path: '/admin/advanced-analytics' },
  { id: 'whatsapp-analytics', label: 'WhatsApp Analytics', icon: MessageCircle, path: '/admin/whatsapp-analytics' },
  { id: 'metrics', label: 'Métricas', icon: BarChart3, path: '/admin/metrics' },
  { id: 'reports', label: 'Relatórios', icon: FileText, path: '/admin/reports' },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const storedEmail = localStorage.getItem('adminEmail');
    
    if (!token) {
      setLocation('/login');
      return;
    }

    setEmail(storedEmail || '');
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white shadow-lg md:min-h-screen">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold">Painel Admin</h2>
          <p className="text-sm text-white/70 mt-2">{email}</p>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto md:overflow-visible">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setLocation(item.path)}
                className="w-full flex items-center gap-3 px-4 py-2 md:py-3 rounded-lg hover:bg-white/10 transition-colors text-left text-sm md:text-base"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="md:absolute md:bottom-0 md:left-0 md:right-0 p-4 border-t border-white/20 space-y-2 flex flex-col md:flex-col">
          <button
            onClick={() => setLocation('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left text-white font-medium border border-white/20"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span>Voltar ao Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/90 transition-colors text-left bg-secondary text-white font-medium"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Bem-vindo ao Painel Administrativo</h1>
          <p className="text-sm md:text-base text-gray-600 mb-8">Gerencie suas vagas, cursos e links de forma centralizada</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Vagas</p>
                  <p className="text-3xl font-bold text-primary mt-2">--</p>
                </div>
                <Briefcase className="w-12 h-12 text-secondary opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Cursos</p>
                  <p className="text-3xl font-bold text-primary mt-2">--</p>
                </div>
                <BookOpen className="w-12 h-12 text-secondary opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Links Criados</p>
                  <p className="text-3xl font-bold text-primary mt-2">--</p>
                </div>
                <Link2 className="w-12 h-12 text-secondary opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Cliques</p>
                  <p className="text-3xl font-bold text-primary mt-2">--</p>
                </div>
                <BarChart3 className="w-12 h-12 text-secondary opacity-20" />
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Cadastro de Vagas</h3>
              <p className="text-gray-600 mb-4">Adicione novas vagas de emprego através de links externos. O sistema extrai automaticamente os dados.</p>
              <button
                onClick={() => setLocation('/admin/jobs')}
                className="inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Ir para Vagas
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Cadastro de Cursos</h3>
              <p className="text-gray-600 mb-4">Adicione novos cursos através de links externos. O sistema extrai automaticamente os dados.</p>
              <button
                onClick={() => setLocation('/admin/courses')}
                className="inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Ir para Cursos
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔗 Gerador de Links</h3>
              <p className="text-gray-600 mb-4">Crie links encurtados e rastreie quantas vezes foram clicados.</p>
              <button
                onClick={() => setLocation('/admin/links')}
                className="inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Ir para Links
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📈 Métricas</h3>
              <p className="text-gray-600 mb-4">Visualize acessos, cliques, redirecionamentos e compartilhamentos.</p>
              <button
                onClick={() => setLocation('/admin/metrics')}
                className="inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Ir para Métricas
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Analytics</h3>
              <p className="text-gray-600 mb-4">Visualize gráficos e tendências de cliques, compartilhamentos e acessos.</p>
              <button
                onClick={() => setLocation('/admin/analytics')}
                className="inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Ir para Analytics
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📈 Relatórios</h3>
              <p className="text-gray-600 mb-4">Visualize métricas e exporte relatórios em PDF.</p>
              <button
                onClick={() => setLocation('/admin/reports')}
                className="inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Ir para Relatórios
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
