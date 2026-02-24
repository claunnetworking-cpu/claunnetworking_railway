import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertCircle, ChevronRight, Clock, CheckCircle, XCircle, Filter, X } from "lucide-react";
import { useState, useMemo } from "react";

/**
 * AdminClientsTab
 * 
 * Aba "Clientes" no painel admin com dashboard de status por tipo de serviço.
 * Inclui filtros avançados por data, empresa, status e tipo de inscrição.
 */

export default function AdminClientsTab() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    status: "" as string,
    companyId: "",
    applicationType: "" as string,
    dateFrom: "",
    dateTo: "",
    searchTerm: "",
  });

  // Buscar estatísticas de pedidos
  const { data: stats, isLoading: statsLoading } = trpc.serviceRequests.getStats.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  // Buscar pedidos com filtros
  const { data: requests, isLoading: requestsLoading } = trpc.serviceRequests.listWithFilters.useQuery(
    {
      serviceType: selectedServiceType as any,
      status: filters.status ? (filters.status as any) : undefined,
      companyId: filters.companyId || undefined,
      applicationType: filters.applicationType ? (filters.applicationType as any) : undefined,
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
      searchTerm: filters.searchTerm || undefined,
    },
    { enabled: !!selectedServiceType && isAuthenticated && user?.role === "admin" }
  );

  const hasActiveFilters = useMemo(() => {
    return (
      filters.status ||
      filters.companyId ||
      filters.applicationType ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.searchTerm
    );
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      status: "",
      companyId: "",
      applicationType: "",
      dateFrom: "",
      dateTo: "",
      searchTerm: "",
    });
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Você precisa ser administrador para acessar este painel.</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      job: "Vagas",
      course: "Cursos",
      mentorship: "Mentorias",
      resume: "Currículos",
    };
    return labels[type] || type;
  };

  const getServiceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      job: "bg-blue-100 text-blue-800",
      course: "bg-green-100 text-green-800",
      mentorship: "bg-purple-100 text-purple-800",
      resume: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      approved: "Aprovado",
      rejected: "Rejeitado",
    };
    return labels[status] || status;
  };

  const getApplicationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      email: "Email",
      whatsapp: "WhatsApp",
      website: "Site",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Dashboard de pedidos por tipo de serviço</p>
        </div>

        {/* Estatísticas Gerais */}
        {statsLoading ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Carregando estatísticas...</p>
            </CardContent>
          </Card>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pendentes</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Aprovados</p>
                    <p className="text-3xl font-bold text-green-600">{stats.approved || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rejeitados</p>
                    <p className="text-3xl font-bold text-red-600">{stats.rejected || 0}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.total || 0}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Tipos de Serviço */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tipos de Serviço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["job", "course", "mentorship", "resume"].map((serviceType) => (
              <Card
                key={serviceType}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedServiceType === serviceType ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedServiceType(selectedServiceType === serviceType ? null : serviceType)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className={getServiceTypeColor(serviceType)}>
                        {getServiceTypeLabel(serviceType)}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-2">
                        {stats?.[`${serviceType}Total` as keyof typeof stats] || 0} pedidos
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detalhes do Tipo Selecionado */}
        {selectedServiceType && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {getServiceTypeLabel(selectedServiceType)} - Detalhes
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={hasActiveFilters ? "ring-2 ring-blue-500" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros {hasActiveFilters && `(${Object.values(filters).filter(Boolean).length})`}
              </Button>
            </div>

            {/* Filtros Avançados */}
            {showFilters && (
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Todos</option>
                        <option value="pending">Pendente</option>
                        <option value="approved">Aprovado</option>
                        <option value="rejected">Rejeitado</option>
                      </select>
                    </div>

                    {/* Tipo de Inscrição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Inscrição</label>
                      <select
                        value={filters.applicationType}
                        onChange={(e) => setFilters({ ...filters, applicationType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Todos</option>
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="website">Site</option>
                      </select>
                    </div>

                    {/* Empresa/Instituição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Empresa/Instituição</label>
                      <input
                        type="text"
                        value={filters.companyId}
                        onChange={(e) => setFilters({ ...filters, companyId: e.target.value })}
                        placeholder="ID da empresa"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Data Início */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Data Fim */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    {/* Busca por Título/Descrição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                      <input
                        type="text"
                        value={filters.searchTerm}
                        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                        placeholder="Título ou descrição"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetFilters}
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Lista de Pedidos */}
            {requestsLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Carregando pedidos...</p>
                </CardContent>
              </Card>
            ) : requests && requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request: any) => (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{request.title}</h3>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1">{getStatusLabel(request.status)}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Empresa</p>
                              <p className="font-medium truncate">{request.companyId}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tipo</p>
                              <p className="font-medium">
                                {request.requestType === "public_link" ? "Com Link" : "Sem Link"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Inscrição</p>
                              <p className="font-medium">{getApplicationTypeLabel(request.applicationType)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Cliques</p>
                              <p className="font-medium">{request.totalClicks || 0}</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate("/admin/service-requests")}
                          className="ml-4"
                        >
                          Gerenciar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">
                    Nenhum pedido encontrado com os filtros selecionados.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
