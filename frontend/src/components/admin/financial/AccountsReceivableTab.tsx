import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AccountsReceivableTab() {
  const receivables = [
    { id: 1, client: "João Silva", amount: 280, dueDate: "2026-02-25", daysOverdue: -5, status: "Pendente" },
    { id: 2, client: "Maria Santos", amount: 450, dueDate: "2026-02-28", daysOverdue: -8, status: "Pendente" },
    { id: 3, client: "Pedro Costa", amount: 129, dueDate: "2026-02-22", daysOverdue: 2, status: "Vencido" },
    { id: 4, client: "Ana Oliveira", amount: 39, dueDate: "2026-03-05", daysOverdue: -13, status: "Pendente" },
    { id: 5, client: "Carlos Mendes", amount: 150, dueDate: "2026-02-20", daysOverdue: 0, status: "Vencido" },
  ];

  const totalReceivable = receivables.reduce((sum, r) => sum + r.amount, 0);
  const overdue = receivables.filter(r => r.daysOverdue > 0).reduce((sum, r) => sum + r.amount, 0);
  const pending = receivables.filter(r => r.daysOverdue <= 0).reduce((sum, r) => sum + r.amount, 0);
  const recoveryRate = ((totalReceivable - overdue) / totalReceivable * 100).toFixed(1);

  const getStatusColor = (status: string) => {
    return status === "Vencido" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Contas a Receber</h2>
        <p className="text-sm text-muted-foreground">Acompanhe valores pendentes e vencidos</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {totalReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">{receivables.length} faturas</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Vencido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">R$ {overdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-red-700">{receivables.filter(r => r.daysOverdue > 0).length} faturas</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">R$ {pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-yellow-700">{receivables.filter(r => r.daysOverdue <= 0).length} faturas</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Taxa Recebimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{recoveryRate}%</p>
            <p className="text-xs text-green-700">Eficiência</p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes por Fatura */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Faturas Detalhadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {receivables.map((receivable) => (
            <div key={receivable.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{receivable.client}</h3>
                  <p className="text-sm text-muted-foreground">
                    Vencimento: {new Date(receivable.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge className={getStatusColor(receivable.status)}>
                  {receivable.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">R$ {receivable.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span className={`text-sm font-semibold ${receivable.daysOverdue > 0 ? "text-red-600" : "text-yellow-600"}`}>
                  {receivable.daysOverdue > 0 ? `Vencido há ${receivable.daysOverdue} dias` : `Vence em ${Math.abs(receivable.daysOverdue)} dias`}
                </span>
              </div>

              <Progress 
                value={receivable.daysOverdue > 0 ? 100 : (Math.abs(receivable.daysOverdue) / 30) * 100} 
                className="h-2"
              />

              <div className="flex gap-2 mt-3">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition">
                  Enviar Cobrança
                </button>
                <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium transition">
                  Marcar como Pago
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Análise */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Análise de Recebimentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Distribuição por Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Vencido</span>
                <div className="flex items-center gap-2">
                  <Progress value={((overdue / totalReceivable) * 100)} className="w-32 h-2" />
                  <span className="text-sm font-semibold">{((overdue / totalReceivable) * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pendente</span>
                <div className="flex items-center gap-2">
                  <Progress value={((pending / totalReceivable) * 100)} className="w-32 h-2" />
                  <span className="text-sm font-semibold">{((pending / totalReceivable) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
