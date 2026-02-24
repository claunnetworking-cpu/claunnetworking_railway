import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: string;
  newValue?: string;
  status: "success" | "failed";
  ipAddress?: string;
  timestamp: string;
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "1",
    adminId: "1",
    adminName: "João Silva",
    action: "UPDATE_PARAMETER",
    resourceType: "system_parameter",
    resourceId: "api_base_url",
    oldValue: "https://old-api.com",
    newValue: "https://new-api.com",
    status: "success",
    ipAddress: "192.168.1.100",
    timestamp: "2026-02-20T10:30:00",
  },
  {
    id: "2",
    adminId: "2",
    adminName: "Maria Santos",
    action: "CREATE_ADMIN_USER",
    resourceType: "admin_user",
    resourceId: "new_admin_123",
    newValue: '{"name":"Pedro Costa","email":"pedro@claunnetworking.com"}',
    status: "success",
    ipAddress: "192.168.1.101",
    timestamp: "2026-02-20T09:15:00",
  },
  {
    id: "3",
    adminId: "1",
    adminName: "João Silva",
    action: "DELETE_JOB",
    resourceType: "job",
    resourceId: "job_456",
    oldValue: '{"title":"Desenvolvedor","company":"Tech Co"}',
    status: "success",
    ipAddress: "192.168.1.100",
    timestamp: "2026-02-20T08:45:00",
  },
  {
    id: "4",
    adminId: "2",
    adminName: "Maria Santos",
    action: "UPDATE_COURSE",
    resourceType: "course",
    resourceId: "course_789",
    oldValue: '{"status":"ativo"}',
    newValue: '{"status":"inativo"}',
    status: "success",
    ipAddress: "192.168.1.101",
    timestamp: "2026-02-20T07:20:00",
  },
  {
    id: "5",
    adminId: "3",
    adminName: "Pedro Costa",
    action: "LOGIN_FAILED",
    resourceType: "admin_user",
    status: "failed",
    ipAddress: "192.168.1.102",
    timestamp: "2026-02-19T23:50:00",
  },
];

const ACTION_COLORS: Record<string, string> = {
  CREATE_ADMIN_USER: "bg-green-100 text-green-800",
  UPDATE_PARAMETER: "bg-blue-100 text-blue-800",
  DELETE_JOB: "bg-red-100 text-red-800",
  UPDATE_COURSE: "bg-yellow-100 text-yellow-800",
  LOGIN_FAILED: "bg-red-100 text-red-800",
  CREATE_BACKUP: "bg-purple-100 text-purple-800",
  DELETE_BACKUP: "bg-red-100 text-red-800",
};

export default function AuditTrailTab() {
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [filterAction, setFilterAction] = useState("");
  const [filterAdmin, setFilterAdmin] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredLogs = logs.filter((log) => {
    if (filterAction && !log.action.includes(filterAction)) return false;
    if (filterAdmin && !log.adminName.includes(filterAdmin)) return false;
    if (filterStatus && log.status !== filterStatus) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE_ADMIN_USER: "Criar Admin",
      UPDATE_PARAMETER: "Atualizar Parâmetro",
      DELETE_JOB: "Deletar Vaga",
      UPDATE_COURSE: "Atualizar Curso",
      LOGIN_FAILED: "Login Falhou",
      CREATE_BACKUP: "Criar Backup",
      DELETE_BACKUP: "Deletar Backup",
    };
    return labels[action] || action;
  };

  const getStatusBadge = (status: string) => {
    return status === "success"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Trilha de Auditoria</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe todas as ações realizadas no sistema
        </p>
      </div>

      {/* Filtros */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Ação
              </label>
              <Input
                placeholder="Filtrar por ação..."
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Administrador
              </label>
              <Input
                placeholder="Filtrar por admin..."
                value={filterAdmin}
                onChange={(e) => setFilterAdmin(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="success">Sucesso</option>
                <option value="failed">Falha</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Ações</CardTitle>
          <CardDescription>
            Total de {filteredLogs.length} ação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Data/Hora
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Administrador
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Ação
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Recurso
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-4 text-foreground whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-foreground">{log.adminName}</td>
                    <td className="py-3 px-4">
                      <Badge className={ACTION_COLORS[log.action] || "bg-gray-100 text-gray-800"}>
                        {getActionLabel(log.action)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {log.resourceType}
                        {log.resourceId && ` (${log.resourceId})`}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusBadge(log.status)}>
                        {log.status === "success" ? "✅ Sucesso" : "❌ Falha"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                      {log.ipAddress || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Nenhum log encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detalhes de Mudanças */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Mudanças Detalhadas</CardTitle>
          <CardDescription>
            Visualize os valores antigos e novos das alterações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs
              .filter((log) => log.oldValue || log.newValue)
              .slice(0, 5)
              .map((log) => (
                <div key={log.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {getActionLabel(log.action)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.adminName} • {formatDate(log.timestamp)}
                      </p>
                    </div>
                    <Badge className={getStatusBadge(log.status)}>
                      {log.status === "success" ? "✅" : "❌"}
                    </Badge>
                  </div>

                  {log.oldValue && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Valor Anterior:
                      </p>
                      <pre className="bg-red-50 p-2 rounded text-xs text-red-900 overflow-x-auto">
                        {log.oldValue}
                      </pre>
                    </div>
                  )}

                  {log.newValue && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Novo Valor:
                      </p>
                      <pre className="bg-green-50 p-2 rounded text-xs text-green-900 overflow-x-auto">
                        {log.newValue}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
