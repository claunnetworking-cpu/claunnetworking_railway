import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Database, Users } from "lucide-react";

interface Metric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: "healthy" | "warning" | "critical";
  threshold: string;
  icon: React.ReactNode;
}

const MOCK_METRICS: Metric[] = [
  {
    id: "1",
    name: "CPU Usage",
    value: "45",
    unit: "%",
    status: "healthy",
    threshold: "80%",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "2",
    name: "Memory Usage",
    value: "62",
    unit: "%",
    status: "healthy",
    threshold: "85%",
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: "3",
    name: "Active Users",
    value: "1234",
    unit: "users",
    status: "healthy",
    threshold: "5000",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "4",
    name: "API Response Time",
    value: "245",
    unit: "ms",
    status: "warning",
    threshold: "200ms",
    icon: <Activity className="w-5 h-5" />,
  },
];

export default function PerformanceMonitoringTab() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "healthy":
        return "🟢 Saudável";
      case "warning":
        return "🟡 Aviso";
      case "critical":
        return "🔴 Crítico";
      default:
        return "Status";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Monitoramento de Desempenho</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe as métricas de desempenho do sistema em tempo real
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_METRICS.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Cabeçalho com ícone */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {metric.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{metric.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Limite: {metric.threshold}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {getStatusLabel(metric.status)}
                  </Badge>
                </div>

                {/* Valor */}
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-3xl font-bold text-foreground">
                    {metric.value}
                    <span className="text-lg ml-2 text-muted-foreground">{metric.unit}</span>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      metric.status === "healthy"
                        ? "bg-green-500"
                        : metric.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (parseInt(metric.value) /
                          parseInt(metric.threshold.replace(/[^0-9]/g, ""))) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela de Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Métricas (últimas 24h)</CardTitle>
          <CardDescription>
            Acompanhe as tendências de desempenho do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Métrica
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Mínimo
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Máximo
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Média
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_METRICS.map((metric) => (
                  <tr key={metric.id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-4 text-foreground">{metric.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {parseInt(metric.value) * 0.7} {metric.unit}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {parseInt(metric.value) * 1.2} {metric.unit}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{metric.value} {metric.unit}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(metric.status)}>
                        {getStatusLabel(metric.status)}
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
