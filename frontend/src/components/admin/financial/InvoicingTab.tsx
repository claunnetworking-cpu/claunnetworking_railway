import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus, Eye, Trash2 } from "lucide-react";

export default function InvoicingTab() {
  const invoices = [
    { id: "INV-001", client: "João Silva", product: "Plano Mentor DESTAQUE", amount: 280, date: "2026-02-20", dueDate: "2026-02-25", status: "Emitida" },
    { id: "INV-002", client: "Maria Santos", product: "Plano Empresa PARCEIRA", amount: 450, date: "2026-02-19", dueDate: "2026-02-28", status: "Emitida" },
    { id: "INV-003", client: "Pedro Costa", product: "Kit Emprego Completo", amount: 129, date: "2026-02-18", dueDate: "2026-02-22", status: "Paga" },
    { id: "INV-004", client: "Ana Oliveira", product: "Currículo Profissional", amount: 39, date: "2026-02-17", dueDate: "2026-03-05", status: "Emitida" },
    { id: "INV-005", client: "Carlos Mendes", product: "Plano Mentor START", amount: 150, date: "2026-02-16", dueDate: "2026-02-20", status: "Paga" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paga":
        return "bg-green-100 text-green-800";
      case "Emitida":
        return "bg-blue-100 text-blue-800";
      case "Cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === "Paga").reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Faturamento</h2>
          <p className="text-sm text-muted-foreground">Gerencie notas fiscais e invoices</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Invoice
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ {totalInvoiced.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">{invoices.length} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">{invoices.filter(i => i.status === "Paga").length} pagas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">R$ {(totalInvoiced - totalPaid).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">{invoices.filter(i => i.status === "Emitida").length} emitidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa Recebimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{((totalPaid / totalInvoiced) * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Do total faturado</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Invoices Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Invoice</th>
                  <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold">Produto</th>
                  <th className="text-left py-3 px-4 font-semibold">Data</th>
                  <th className="text-left py-3 px-4 font-semibold">Vencimento</th>
                  <th className="text-right py-3 px-4 font-semibold">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-blue-600">{invoice.id}</td>
                    <td className="py-3 px-4">{invoice.client}</td>
                    <td className="py-3 px-4 text-muted-foreground">{invoice.product}</td>
                    <td className="py-3 px-4">{new Date(invoice.date).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4 text-right font-semibold">R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded" title="Visualizar">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Download">
                          <Download className="w-4 h-4 text-blue-600" />
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

      {/* Configurações de Faturamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Configurações de Faturamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Razão Social</label>
              <input type="text" placeholder="Sua Empresa LTDA" className="w-full mt-1 px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">CNPJ</label>
              <input type="text" placeholder="00.000.000/0000-00" className="w-full mt-1 px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Email para Invoices</label>
              <input type="email" placeholder="financeiro@empresa.com" className="w-full mt-1 px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium">Dias para Vencimento</label>
              <input type="number" placeholder="30" className="w-full mt-1 px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <Button className="w-full">Salvar Configurações</Button>
        </CardContent>
      </Card>
    </div>
  );
}
