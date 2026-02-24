import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionHistoryTab() {
  const transactions = [
    { id: 1, date: "2026-02-20", time: "14:30", client: "João Silva", product: "Plano Mentor DESTAQUE", amount: 280, type: "entrada", method: "Cartão", status: "Concluído" },
    { id: 2, date: "2026-02-20", time: "10:15", client: "Maria Santos", product: "Plano Empresa PARCEIRA", amount: 450, type: "entrada", method: "PIX", status: "Concluído" },
    { id: 3, date: "2026-02-19", time: "16:45", client: "Pedro Costa", product: "Kit Emprego Completo", amount: 129, type: "entrada", method: "Boleto", status: "Pendente" },
    { id: 4, date: "2026-02-19", time: "09:20", client: "Ana Oliveira", product: "Currículo Profissional", amount: 39, type: "entrada", method: "Cartão", status: "Concluído" },
    { id: 5, date: "2026-02-18", time: "13:00", client: "Carlos Mendes", product: "Plano Mentor START", amount: 150, type: "entrada", method: "PIX", status: "Concluído" },
    { id: 6, date: "2026-02-18", time: "11:30", client: "Sistema", product: "Taxa de Processamento", amount: -45.50, type: "saida", method: "Automático", status: "Concluído" },
    { id: 7, date: "2026-02-17", time: "15:00", client: "Empresa XYZ", product: "Reembolso - Cancelamento", amount: -280, type: "saida", method: "Cartão", status: "Concluído" },
  ];

  const getStatusColor = (status: string) => {
    return status === "Concluído" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "Cartão":
        return "bg-blue-50 text-blue-700";
      case "PIX":
        return "bg-purple-50 text-purple-700";
      case "Boleto":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Histórico de Transações</h2>
          <p className="text-sm text-muted-foreground">Todas as transações financeiras do sistema</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              Total Entradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ 1.048,00</p>
            <p className="text-xs text-muted-foreground">5 transações</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-red-600" />
              Total Saídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ 325,50</p>
            <p className="text-xs text-muted-foreground">2 transações</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">R$ 722,50</p>
            <p className="text-xs text-muted-foreground">Período: Últimos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-semibold">Cliente/Descrição</th>
                  <th className="text-left py-3 px-4 font-semibold">Produto</th>
                  <th className="text-left py-3 px-4 font-semibold">Método</th>
                  <th className="text-right py-3 px-4 font-semibold">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{tx.client}</td>
                    <td className="py-3 px-4 text-muted-foreground">{tx.product}</td>
                    <td className="py-3 px-4">
                      <Badge className={getMethodColor(tx.method)}>
                        {tx.method}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      <span className={tx.type === "entrada" ? "text-green-600" : "text-red-600"}>
                        {tx.type === "entrada" ? "+" : "-"} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(tx.status)}>
                        {tx.status}
                      </Badge>
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
