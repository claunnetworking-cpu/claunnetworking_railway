import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Edit2, Trash2, Eye } from "lucide-react";

export default function BillingTab() {
  const billings = [
    { id: 1, client: "João Silva", product: "Plano Mentor DESTAQUE", amount: 280, dueDate: "2026-02-25", status: "Pendente", days: 5 },
    { id: 2, client: "Maria Santos", product: "Plano Empresa PARCEIRA", amount: 450, dueDate: "2026-02-28", status: "Pendente", days: 8 },
    { id: 3, client: "Pedro Costa", product: "Kit Emprego Completo", amount: 129, dueDate: "2026-02-22", status: "Vencido", days: -2 },
    { id: 4, client: "Ana Oliveira", product: "Currículo Profissional", amount: 39, dueDate: "2026-03-05", status: "Pendente", days: 13 },
    { id: 5, client: "Carlos Mendes", product: "Plano Mentor START", amount: 150, dueDate: "2026-02-20", status: "Pago", days: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysColor = (days: number) => {
    if (days < 0) return "text-red-600";
    if (days <= 5) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cobranças</h2>
          <p className="text-sm text-muted-foreground">Gerencie cobranças e faturas pendentes</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Cobrança
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ 848,00</p>
            <p className="text-xs text-muted-foreground">3 cobranças</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">R$ 129,00</p>
            <p className="text-xs text-muted-foreground">1 cobrança</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Próximos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">R$ 730,00</p>
            <p className="text-xs text-muted-foreground">2 cobranças</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa Recebimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">92%</p>
            <p className="text-xs text-muted-foreground">Excelente</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Cobranças */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Lista de Cobranças</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold">Produto</th>
                  <th className="text-right py-3 px-4 font-semibold">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold">Vencimento</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {billings.map((billing) => (
                  <tr key={billing.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{billing.client}</td>
                    <td className="py-3 px-4 text-muted-foreground">{billing.product}</td>
                    <td className="py-3 px-4 text-right font-semibold">R$ {billing.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p>{new Date(billing.dueDate).toLocaleDateString('pt-BR')}</p>
                        <p className={`text-xs font-semibold ${getDaysColor(billing.days)}`}>
                          {billing.days < 0 ? `Vencido há ${Math.abs(billing.days)} dias` : billing.days === 0 ? "Vence hoje" : `Vence em ${billing.days} dias`}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(billing.status)}>
                        {billing.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded" title="Visualizar">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Editar">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Deletar">
                          <Trash2 className="w-4 h-4 text-red-600" />
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
