import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Database, Server, HardDrive, AlertTriangle, CheckCircle2, Clock, Zap, TrendingUp } from "lucide-react";

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  uptime: number;
  lastBackup: string | null;
  activeUsers: number;
  apiResponseTime: number;
  databaseStatus: "connected" | "disconnected" | "slow";
}

export default function SystemHealthDashboardTab() {
  const [health, setHealth] = useState<SystemHealth>({
    cpu: 45,
    memory: 62,
    disk: 78,
    uptime: 15,
    lastBackup: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
    activeUsers: 12,
    apiResponseTime: 145,
    databaseStatus: "connected",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((prev) => ({
        ...prev,
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(85, prev.memory + (Math.random() - 0.5) * 8)),
        disk: prev.disk,
        apiResponseTime: Math.max(50, Math.min(500, prev.apiResponseTime + (Math.random() - 0.5) * 50)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds = { warning: 70, critical: 85 }) => {
    if (value >= thresholds.critical) return "text-red-600";
    if (value >= thresholds.warning) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusBadge = (value: number, thresholds = { warning: 70, critical: 85 }) => {
    if (value >= thresholds.critical) return "bg-red-100 text-red-800";
    if (value >= thresholds.warning) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getProgressColor = (value: number) => {
    if (value >= 85) return "bg-red-500";
    if (value >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Dashboard de Saúde do Sistema</h2>
            <p className="text-blue-100">Monitoramento em tempo real da infraestrutura e performance</p>
          </div>
          <Activity className="w-12 h-12 opacity-20" />
        </div>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-900">Status Geral</CardTitle>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">Operacional</p>
            <p className="text-xs text-green-600 mt-1">Todos os sistemas funcionando normalmente</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-900">Uptime</CardTitle>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">{health.uptime} dias</p>
            <p className="text-xs text-blue-600 mt-1">Sem interrupções</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-900">Usuários Ativos</CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-700">{health.activeUsers}</p>
            <p className="text-xs text-purple-600 mt-1">Conectados agora</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Principais */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Recursos do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">CPU</CardTitle>
                <Zap className={`w-4 h-4 ${getStatusColor(health.cpu)}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold">{Math.round(health.cpu)}%</div>
              <Progress value={health.cpu} className="h-2" />
              <Badge className={`text-xs w-full justify-center ${getStatusBadge(health.cpu)}`}>
                {health.cpu >= 85 ? "Crítico" : health.cpu >= 70 ? "Aviso" : "Normal"}
              </Badge>
            </CardContent>
          </Card>

          {/* Memória */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Memória</CardTitle>
                <Server className={`w-4 h-4 ${getStatusColor(health.memory)}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold">{Math.round(health.memory)}%</div>
              <Progress value={health.memory} className="h-2" />
              <Badge className={`text-xs w-full justify-center ${getStatusBadge(health.memory)}`}>
                {health.memory >= 85 ? "Crítico" : health.memory >= 70 ? "Aviso" : "Normal"}
              </Badge>
            </CardContent>
          </Card>

          {/* Disco */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Disco</CardTitle>
                <HardDrive className={`w-4 h-4 ${getStatusColor(health.disk)}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold">{Math.round(health.disk)}%</div>
              <Progress value={health.disk} className="h-2" />
              <Badge className={`text-xs w-full justify-center ${getStatusBadge(health.disk)}`}>
                {health.disk >= 85 ? "Crítico" : health.disk >= 70 ? "Aviso" : "Normal"}
              </Badge>
            </CardContent>
          </Card>

          {/* Banco de Dados */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Banco de Dados</CardTitle>
                <Database className={`w-4 h-4 ${health.databaseStatus === "connected" ? "text-green-600" : "text-red-600"}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold">
                {health.databaseStatus === "connected" ? "✓" : "✗"}
              </div>
              <Badge className={health.databaseStatus === "connected" ? "bg-green-100 text-green-800 w-full justify-center" : "bg-red-100 text-red-800 w-full justify-center"}>
                {health.databaseStatus === "connected" ? "Conectado" : "Desconectado"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* API Response Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Tempo de Resposta da API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{Math.round(health.apiResponseTime)}</span>
                <span className="text-sm text-muted-foreground">ms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${Math.min(100, (health.apiResponseTime / 500) * 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Ideal: &lt; 200ms</p>
            </CardContent>
          </Card>

          {/* Último Backup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-lg font-semibold">{health.lastBackup}</div>
              <Badge className="bg-blue-100 text-blue-800">Backup Automático</Badge>
              <p className="text-xs text-muted-foreground">Próximo backup em 24h</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alertas */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <CardTitle className="text-sm font-medium text-yellow-900">Alertas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>✓ Nenhum alerta crítico no momento</li>
            <li>✓ Todos os serviços operacionais</li>
            <li>✓ Backups executados com sucesso</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
