import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Eye, Mail, Phone } from "lucide-react";

export default function ClientListTab() {
  const clients = [
    { id: 1, name: "João Silva", company: "Tech Solutions", email: "joao@tech.com", phone: "(11) 98765-4321", status: "Ativo", lastContact: "2026-02-20", value: 2800 },
    { id: 2, name: "Maria Santos", company: "Inovação Digital", email: "maria@inovacao.com", phone: "(21) 99876-5432", status: "Ativo", lastContact: "2026-02-18", value: 4500 },
    { id: 3, name: "Pedro Costa", company: "Consultoria XYZ", email: "pedro@consultoria.com", phone: "(31) 97654-3210", status: "Inativo", lastContact: "2026-01-15", value: 1200 },
    { id: 4, name: "Ana Oliveira", company: "Startup ABC", email: "ana@startup.com", phone: "(41) 98765-4321", status: "Ativo", lastContact: "2026-02-19", value: 890 },
    { id: 5, name: "Carlos Mendes", company: "Empresa Ltda", email: "carlos@empresa.com", phone: "(51) 99876-5432", status: "Ativo", lastContact: "2026-02-17", value: 3200 },
  ];

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === "Ativo").length;
  const totalValue = clients.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lista de Clientes</h2>
          <p className="text-sm text-muted-foreground">Gerencie todos os seus clientes cadastrados</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClients}</p>
            <p className="text-xs text-muted-foreground">Cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{activeClients}</p>
            <p className="text-xs text-muted-foreground">{((activeClients / totalClients) * 100).toFixed(0)}% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">Em contratos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {(totalValue / totalClients).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground">Por cliente</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Clientes Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold">Contato</th>
                  <th className="text-left py-3 px-4 font-semibold">Último Contato</th>
                  <th className="text-right py-3 px-4 font-semibold">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{client.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{client.company}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <a href={`mailto:${client.email}`} className="text-blue-600 hover:text-blue-800" title="Email">
                          <Mail className="w-4 h-4" />
                        </a>
                        <a href={`tel:${client.phone}`} className="text-blue-600 hover:text-blue-800" title="Telefone">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4">{new Date(client.lastContact).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4 text-right font-semibold">R$ {client.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
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
