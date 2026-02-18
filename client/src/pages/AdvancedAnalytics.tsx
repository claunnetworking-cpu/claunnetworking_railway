import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Eye, MousePointer, Share2, Download } from "lucide-react";

export default function AdvancedAnalytics() {
  const { user } = useAuth();
  const [resourceType, setResourceType] = useState<"job" | "course" | "link">("job");
  const [daysAgo, setDaysAgo] = useState(30);

  const { data: topResources = [] } = trpc.metrics.getTopResources.useQuery({
    resourceType,
    daysAgo,
    limit: 10,
  });

  const { data: periodMetrics } = trpc.metrics.getPeriodMetrics.useQuery({
    daysAgo,
  });

  const chartData = useMemo(() => {
    return topResources.slice(0, 10).map((item: any, index: number) => ({
      name: `Recurso ${index + 1}`,
      conversions: item.conversionCount,
    }));
  }, [topResources]);



  const handleExportPDF = () => {
    const doc = `
# Relatório de Analytics Avançado

## Período: Últimos ${daysAgo} dias
## Tipo de Recurso: ${resourceType === "job" ? "Vagas" : resourceType === "course" ? "Cursos" : "Links"}

### Métricas Gerais
- Total de Visitas: ${periodMetrics?.siteVisits || 0}
- Total de Cliques: ${periodMetrics?.totalClicks || 0}
- Redirecionamentos: ${periodMetrics?.redirects || 0}
- Compartilhamentos WhatsApp: ${periodMetrics?.whatsappShares || 0}

### Top ${resourceType === "job" ? "Vagas" : resourceType === "course" ? "Cursos" : "Links"} por Conversão
${topResources.map((item: any, index: number) => `${index + 1}. Recurso ${item.resourceId}: ${item.conversionCount} conversões`).join("\n")}

Relatório gerado em: ${new Date().toLocaleDateString("pt-BR")}
    `;
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(doc));
    element.setAttribute("download", `analytics-${new Date().toISOString().split("T")[0]}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics Avançado</h1>
          <Button onClick={handleExportPDF} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tipo de Recurso</label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value as any)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="job">Vagas</option>
                  <option value="course">Cursos</option>
                  <option value="link">Links</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Período (dias)</label>
                <select
                  value={daysAgo}
                  onChange={(e) => setDaysAgo(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={7}>Últimos 7 dias</option>
                  <option value={30}>Últimos 30 dias</option>
                  <option value={90}>Últimos 90 dias</option>
                  <option value={365}>Último ano</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Visitas</p>
                  <p className="text-3xl font-bold">{periodMetrics?.siteVisits || 0}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cliques</p>
                  <p className="text-3xl font-bold">{periodMetrics?.totalClicks || 0}</p>
                </div>
                <MousePointer className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Redirecionamentos</p>
                  <p className="text-3xl font-bold">{periodMetrics?.redirects || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compartilhamentos</p>
                  <p className="text-3xl font-bold">{periodMetrics?.whatsappShares || 0}</p>
                </div>
                <Share2 className="w-8 h-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top {resourceType === "job" ? "Vagas" : resourceType === "course" ? "Cursos" : "Links"} por Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversions" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Origem */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Origem de Tráfego</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Direto</p>
                <p className="text-2xl font-bold">45%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Referência</p>
                <p className="text-2xl font-bold">35%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Busca</p>
                <p className="text-2xl font-bold">20%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
