import { useEffect, useMemo, useState } from "react";
import { api, withTenant } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";

type Metrics = {
  MRR: number;
  ARR: number;
  TotalRevenue: number;
  ChurnRate: number;
};

export default function AdminFinanceDashboard() {
  const [tenantId, setTenantId] = useState<string>(import.meta.env.VITE_DEFAULT_TENANT_ID || "");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canFetch = useMemo(() => tenantId.trim().length > 0, [tenantId]);

  async function fetchMetrics() {
    if (!canFetch) {
      setErr("Informe um Tenant ID (UUID) para consultar as métricas.");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get<Metrics>("/dashboard/metrics", withTenant(tenantId.trim()));
      setMetrics(data);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Falha ao consultar métricas.";
      setErr(String(msg));
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tenantId) fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Painel Executivo Financeiro</h1>
        <p className="text-sm text-muted-foreground">
          Métricas calculadas pela API (MRR, ARR, Receita Total e Churn). Use o mesmo layout/paleta do projeto original.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder="Cole o tenant_id (UUID) aqui..."
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
          />
          <Button onClick={fetchMetrics} disabled={loading || !canFetch} className="gap-2">
            <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
            {loading ? "Carregando..." : "Atualizar"}
          </Button>
        </CardContent>
      </Card>

      {err && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>MRR</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{metrics ? metrics.MRR.toFixed(2) : "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>ARR</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{metrics ? metrics.ARR.toFixed(2) : "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Receita Total</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{metrics ? metrics.TotalRevenue.toFixed(2) : "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Churn</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{metrics ? `${metrics.ChurnRate.toFixed(2)}%` : "-"}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Testes rápidos</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>• Backend health: <code className="text-foreground">GET {import.meta.env.VITE_API_URL}/health</code></div>
          <div>• Métricas: <code className="text-foreground">GET {import.meta.env.VITE_API_URL}/dashboard/metrics</code> com header <code className="text-foreground">x-tenant-id</code></div>
          <div>• Prometheus: <code className="text-foreground">GET {import.meta.env.VITE_API_URL}/metrics</code></div>
        </CardContent>
      </Card>
    </div>
  );
}
