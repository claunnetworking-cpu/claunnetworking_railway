import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, Share2, TrendingUp, Users, Loader2, Download } from "lucide-react";
import { useMemo } from "react";

export default function AdminWhatsappAnalytics() {
  const { user, loading } = useAuth();
  const allSharesQuery = trpc.whatsapp.getShare.useQuery({ shareToken: "" }, { enabled: false });

  const analyticsQuery = trpc.whatsapp.getResourceAnalytics.useQuery(
    { resourceType: 'job', resourceId: '' },
    { enabled: false }
  );

  // Get all whatsapp shares for analytics
  const sharesQuery = trpc.whatsapp.getShare.useQuery(
    { shareToken: '' },
    { enabled: false }
  );

  // Mock data for now - in production, fetch from server
  const analyticsData: any[] = [];

  const stats = useMemo(() => {
    if (!analyticsData || (analyticsData as any[]).length === 0) return null;

    const totalShares = analyticsData.length;
    const totalClicks = analyticsData.reduce((sum: number, a: any) => sum + (a.totalClicks || 0), 0);
    const totalConversions = analyticsData.reduce((sum: number, a: any) => sum + (a.totalConversions || 0), 0);
    const avgConversionRate = totalClicks > 0
      ? ((totalConversions / totalClicks) * 100).toFixed(2)
      : "0";

    return {
      totalShares,
      totalClicks,
      totalConversions,
      avgConversionRate,
    };
  }, [analyticsData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Análise WhatsApp
          </h1>
          <p className="text-gray-600">
            Acompanhe o desempenho dos compartilhamentos via WhatsApp
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Compartilhamentos</CardTitle>
                <Share2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalShares}</div>
                <p className="text-xs text-gray-600">últimos 30 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
                <BarChart3 className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClicks}</div>
                <p className="text-xs text-gray-600">últimos 30 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalConversions}</div>
                <p className="text-xs text-gray-600">últimos 30 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgConversionRate}%</div>
                <p className="text-xs text-gray-600">média</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Compartilhamentos Detalhados</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {analyticsData && analyticsData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Compartilhamentos</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliques</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Conversões</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Taxa (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.map((analytic: any) => (
                      <tr key={analytic.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-mono text-xs">
                          {analytic.shareToken.substring(0, 8)}...
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            analytic.resourceType === 'job'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {analytic.resourceType === 'job' ? 'Vaga' : 'Curso'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{analytic.totalShares || 0}</td>
                        <td className="py-3 px-4 text-gray-900">{analytic.totalClicks || 0}</td>
                        <td className="py-3 px-4 text-gray-900">{analytic.totalConversions || 0}</td>
                        <td className="py-3 px-4 text-gray-900 font-semibold">
                          {analytic.conversionRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhum compartilhamento registrado ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
