import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertCircle, ArrowLeft, Calendar } from "lucide-react";
import { useState } from "react";

/**
 * StatisticsPage
 * 
 * Dashboard de estatísticas para empresas/instituições visualizarem:
 * - Cliques por vaga/curso
 * - Filtros por período (últimos 7 dias, 30 dias, 90 dias, personalizado)
 * - Gráficos de tendência
 * 
 * Métricas rastreadas:
 * - totalClicks: Número de cliques no link compartilhável
 * - totalViews: Número de visualizações da vaga/curso
 */

export default function StatisticsPage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [period, setPeriod] = useState<"7days" | "30days" | "90days" | "all">("30days");

  // Buscar dados da empresa
  const { data: requests, isLoading, error } = trpc.serviceRequests.getByCompany.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Filtrar apenas vagas/cursos aprovados
  const approvedRequests = requests?.filter((r: any) => r.status === "approved") || [];

  // Calcular estatísticas totais
  const totalClicks = approvedRequests.reduce((sum: number, r: any) => sum + (r.totalClicks || 0), 0);
  const totalViews = approvedRequests.reduce((sum: number, r: any) => sum + (r.totalViews || 0), 0);
  const avgClicksPerItem = approvedRequests.length > 0 ? (totalClicks / approvedRequests.length).toFixed(1) : 0;

  // Ordenar por cliques (mais popular primeiro)
  const sortedByClicks = [...approvedRequests].sort((a: any, b: any) => (b.totalClicks || 0) - (a.totalClicks || 0));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Você precisa estar autenticado para acessar este painel.</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estatísticas</h1>
            <p className="text-gray-600 mt-2">Acompanhe o desempenho de suas vagas e cursos</p>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        {/* Filtro de Período */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "7days", label: "Últimos 7 dias" },
                { value: "30days", label: "Últimos 30 dias" },
                { value: "90days", label: "Últimos 90 dias" },
                { value: "all", label: "Todos os períodos" },
              ].map((option) => (
                <Button
                  key={option.value}
                  onClick={() => setPeriod(option.value as any)}
                  variant={period === option.value ? "default" : "outline"}
                  className={period === option.value ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Carregando estatísticas...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p>Erro ao carregar estatísticas: {error.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && approvedRequests.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Você ainda não tem nenhuma vaga ou curso aprovado.</p>
                <Button
                  onClick={() => navigate("/company-dashboard")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Publicar Primeira Vaga
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas Gerais */}
        {!isLoading && !error && approvedRequests.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Card: Total de Cliques */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total de Cliques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{totalClicks}</div>
                  <p className="text-xs text-gray-500 mt-1">Cliques no link compartilhável</p>
                </CardContent>
              </Card>

              {/* Card: Total de Visualizações */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total de Visualizações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{totalViews}</div>
                  <p className="text-xs text-gray-500 mt-1">Visualizações das vagas/cursos</p>
                </CardContent>
              </Card>

              {/* Card: Média de Cliques */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Média de Cliques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{avgClicksPerItem}</div>
                  <p className="text-xs text-gray-500 mt-1">Por vaga/curso</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Vagas/Cursos */}
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Vaga/Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Cliques</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Visualizações</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Taxa de Clique</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedByClicks.map((request: any) => {
                        const clicks = request.totalClicks || 0;
                        const views = request.totalViews || 0;
                        const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0";

                        return (
                          <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{request.title}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {request.serviceType === "job" ? "Vaga" : "Curso"}
                                </p>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">
                              <div className="text-lg font-semibold text-gray-900">{clicks}</div>
                            </td>
                            <td className="text-right py-3 px-4">
                              <div className="text-lg font-semibold text-gray-900">{views}</div>
                            </td>
                            <td className="text-right py-3 px-4">
                              <div className="text-lg font-semibold text-gray-900">{ctr}%</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sortedByClicks.length > 0 && (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Mais Popular</p>
                      <p className="text-gray-700">
                        <strong>{sortedByClicks[0].title}</strong> é sua vaga/curso mais clicada com{" "}
                        <strong>{sortedByClicks[0].totalClicks || 0} cliques</strong>.
                      </p>
                    </div>

                    {sortedByClicks.length > 1 && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm font-semibold text-green-900 mb-1">Recomendação</p>
                        <p className="text-gray-700">
                          Considere replicar a estratégia de{" "}
                          <strong>{sortedByClicks[0].title}</strong> em suas outras{" "}
                          {approvedRequests.length > 1 ? "vagas/cursos" : "publicações"}.
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">Nota sobre Métricas</p>
                  <p className="text-gray-700 text-sm">
                    As métricas mostram apenas <strong>cliques</strong> no link compartilhável. Inscrições
                    são enviadas diretamente para seu email/WhatsApp/site e não são rastreadas neste sistema.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
