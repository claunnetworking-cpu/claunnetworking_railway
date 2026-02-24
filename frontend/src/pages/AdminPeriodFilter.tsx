import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import PeriodFilterTab from '@/components/admin/analytics/PeriodFilterTab';

export default function AdminPeriodFilter() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Filtros por Período</h1>
          <p className="text-gray-600">Analise o desempenho com filtros avançados por período</p>
        </div>

        <PeriodFilterTab />
      </div>
    </div>
  );
}
