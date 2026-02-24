import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Database, Server, HardDrive, AlertTriangle, CheckCircle2, Clock, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";

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

export default function SystemHealthDashboard() {
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

  // Simular atualização de dados em tempo real
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard de Saúde do Sistema</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Monitoramento em tempo real da infraestrutura e performance
        </p>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">CPU</CardTitle>
              <Zap className={`w-4 h-4 ${getStatusColor(health.cpu)}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{Math.round(health.cpu)}%</div>
            <Progress value={health.cpu} className="h-2" />
            <Badge className={`text-xs ${getStatusBadge(health.cpu)}`}>
              {health.cpu > 85 ? "Crítico" : health.cpu > 70 ? "Aviso" : "Normal"}
            </Badge>
          </CardContent>
        </Card>

        {/* Memória */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Memória</CardTitle>
              <Activity className={`w-4 h-4 ${getStatusColor(health.memory)}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{Math.round(health.memory)}%</div>
            <Progress value={health.memory} className="h-2" />
            <Badge className={`text-xs ${getStatusBadge(health.memory)}`}>
              {health.memory > 85 ? "Crítico" : health.memory > 70 ? "Aviso" : "Normal"}
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
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{Math.round(health.disk)}%</div>
            <Progress value={health.disk} className="h-2" />
            <Badge className={`text-xs ${getStatusBadge(health.disk)}`}>
              {health.disk > 85 ? "Crítico" : health.disk > 70 ? "Aviso" : "Normal"}
            </Badge>
          </CardContent>
        </Card>

        {/* Banco de Dados */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Banco de Dados</CardTitle>
              <Database className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {health.databaseStatus === "connected" ? "Online" : "Offline"}
            </div>
            <Badge className={`text-xs ${
              health.databaseStatus === "connected"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {health.databaseStatus === "connected" ? "Conectado" : "Desconectado"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tempo de Resposta da API */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tempo de Resposta da API</CardTitle>
            <CardDescription>Latência média</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div>
                <div className="text-3xl font-bold">{Math.round(health.apiResponseTime)}</div>
                <p className="text-sm text-muted-foreground">ms</p>
              </div>
              <div className="flex-1">
                <Progress value={Math.min(health.apiResponseTime / 5, 100)} className="h-2" />
              </div>
            </div>
            <Badge className={`text-xs ${
              health.apiResponseTime > 300
                ? "bg-red-100 text-red-800"
                : health.apiResponseTime > 200
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}>
              {health.apiResponseTime > 300 ? "Lento" : health.apiResponseTime > 200 ? "Moderado" : "Rápido"}
            </Badge>
          </CardContent>
        </Card>

        {/* Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações do Sistema</CardTitle>
            <CardDescription>Status geral</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tempo de atividade:</span>
              <span className="font-semibold">{health.uptime} dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Usuários ativos:</span>
              <span className="font-semibold">{health.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Último backup:</span>
              <span className="font-semibold text-xs">{health.lastBackup}</span>
            </div>
            <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-md">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">Sistema operacional normalmente</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <CardTitle className="text-base text-yellow-900">Alertas Ativos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {health.cpu > 80 || health.memory > 80 || health.disk > 85 ? (
            <ul className="space-y-2">
              {health.cpu > 80 && (
                <li className="text-sm text-yellow-800">
                  ⚠️ CPU em nível elevado ({Math.round(health.cpu)}%)
                </li>
              )}
              {health.memory > 80 && (
                <li className="text-sm text-yellow-800">
                  ⚠️ Memória em nível elevado ({Math.round(health.memory)}%)
                </li>
              )}
              {health.disk > 85 && (
                <li className="text-sm text-yellow-800">
                  ⚠️ Espaço em disco crítico ({Math.round(health.disk)}%)
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-yellow-800">✓ Nenhum alerta ativo no momento</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
