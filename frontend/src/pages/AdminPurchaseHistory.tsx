import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import PurchaseHistoryTab from '@/components/admin/analytics/PurchaseHistoryTab';

export default function AdminPurchaseHistory() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-white hover:opacity-80 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold">Histórico de Compras</h1>
          <p className="text-purple-100 mt-1">Acompanhe todas as compras de clientes e renovações</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PurchaseHistoryTab />
      </div>
    </div>
  );
}
