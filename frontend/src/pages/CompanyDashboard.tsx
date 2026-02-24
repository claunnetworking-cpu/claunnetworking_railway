import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, Clock, Eye, MousePointerClick, Settings, Plus, Zap, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect } from "react";
import { CreateJobForm } from "@/components/CreateJobForm";

const PLANS_CATEGORY = "divulgar-vaga";

export default function CompanyDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCreateJobForm, setShowCreateJobForm] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();
  const { data: productsData, isLoading: isLoadingProducts } = trpc.products.getByCategory.useQuery({ 
    category: PLANS_CATEGORY 
  });

  // Update plans when products data changes
  useEffect(() => {
    if (productsData && Array.isArray(productsData)) {
      setPlans(productsData as any[]);
    }
  }, [productsData]);

  const handleUpgrade = async (planId: string, planName: string) => {
    try {
      const result = await createCheckoutMutation.mutateAsync({
        productId: planId,
        origin: window.location.origin,
      });

      if (result.url) {
        // Redirecionar para checkout
        window.open(result.url, '_blank');
        setShowUpgradeModal(false);
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  // Mock data - será substituído por dados reais da API
  const companyData = {
    name: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    cnpj: "12.345.678/0001-90",
    jobsPosted: 12,
    jobsActive: 8,
    jobsFinished: 4,
    totalClicks: 234,
    totalViews: 1250,
    totalShares: 45,
  };

  const pendingRequests = [
    {
      id: "1",
      title: "Senior Developer",
      status: "pending",
      createdAt: "2026-02-20",
      type: "vaga_com_link",
    },
    {
      id: "2",
      title: "Product Manager",
      status: "rejected",
      rejectionReason: "Link inválido ou expirado. Por favor, verifique o URL.",
      createdAt: "2026-02-18",
      type: "vaga_sem_link",
    },
  ];

  const approvedRequests = [
    {
      id: "3",
      title: "Frontend Engineer",
      status: "approved",
      createdAt: "2026-02-15",
      clicks: 45,
      views: 320,
    },
    {
      id: "4",
      title: "Data Analyst",
      status: "approved",
      createdAt: "2026-02-10",
      clicks: 23,
      views: 180,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejeitado</Badge>;
      case "analysis":
        return <Badge className="bg-blue-500">Em Análise</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Painel da Empresa</h1>
          <p className="text-slate-600">Gerencie suas publicações e acompanhe o desempenho</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-purple-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Vagas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{companyData.jobsActive}</div>
              <p className="text-xs text-purple-100 mt-1">de {companyData.jobsPosted} publicadas</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MousePointerClick className="w-4 h-4" /> Cliques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{companyData.totalClicks}</div>
              <p className="text-xs text-purple-100 mt-1">Total de cliques</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="w-4 h-4" /> Visualizações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{companyData.totalViews}</div>
              <p className="text-xs text-purple-100 mt-1">Total de visualizações</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Compartilhamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{companyData.totalShares}</div>
              <p className="text-xs text-purple-100 mt-1">Via WhatsApp</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="approved">Aprovados</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Publicações</CardTitle>
                <CardDescription>Acompanhe o status de suas publicações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">Total de Vagas Publicadas</p>
                      <p className="text-sm text-slate-600">{companyData.jobsPosted} vagas</p>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{companyData.jobsPosted}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">Vagas Ativas</p>
                      <p className="text-sm text-slate-600">{companyData.jobsActive} vagas em andamento</p>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{companyData.jobsActive}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">Vagas Finalizadas</p>
                      <p className="text-sm text-slate-600">{companyData.jobsFinished} vagas concluídas</p>
                    </div>
                    <span className="text-2xl font-bold text-slate-600">{companyData.jobsFinished}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                  onClick={() => setLocation('/company-post-job')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar Nova Vaga
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Pendentes</CardTitle>
                <CardDescription>Publicações aguardando análise ou com problemas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <p className="text-center text-slate-600 py-8">Nenhum pedido pendente</p>
                ) : (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{request.title}</h3>
                          <p className="text-sm text-slate-600">Criado em {request.createdAt}</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      {request.status === "rejected" && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900">Motivo da Rejeição:</p>
                            <p className="text-sm text-red-800">{request.rejectionReason}</p>
                          </div>
                        </div>
                      )}

                      <Button variant="outline" className="w-full mt-3">
                        {request.status === "rejected" ? "Ajustar e Reenviar" : "Ver Detalhes"}
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Publicações Aprovadas</CardTitle>
                <CardDescription>Suas vagas ativas na plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {approvedRequests.length === 0 ? (
                  <p className="text-center text-slate-600 py-8">Nenhuma publicação aprovada</p>
                ) : (
                  approvedRequests.map((request) => (
                    <div key={request.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{request.title}</h3>
                          <p className="text-sm text-slate-600">Publicado em {request.createdAt}</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-600 font-medium">Cliques</p>
                          <p className="text-lg font-bold text-blue-900">{request.clicks}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-600 font-medium">Visualizações</p>
                          <p className="text-lg font-bold text-green-900">{request.views}</p>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-3">
                        Ver Estatísticas
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>Gerencie os dados da sua empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Informações da Empresa
                  </h3>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Nome da Empresa</p>
                      <p className="text-slate-900">{companyData.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">CNPJ</p>
                      <p className="text-slate-900">{companyData.cnpj}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Email</p>
                      <p className="text-slate-900">{companyData.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Plano Atual
                  </h3>
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 mb-2">Você está no plano</p>
                    <p className="text-2xl font-bold text-purple-900 mb-1">Profissional - R$ 199/mês</p>
                    <p className="text-sm text-purple-700 mb-4">8 de 15 vagas utilizadas</p>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      Fazer Upgrade
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Segurança</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Alterar Senha
                    </Button>
                    <Button variant="outline" className="w-full">
                      Ativar Autenticação de Dois Fatores
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                      Excluir Conta (Irreversível)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Job Form Modal */}
        <Dialog open={showCreateJobForm} onOpenChange={setShowCreateJobForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Publicar Nova Vaga</DialogTitle>
              <DialogDescription>
                Preencha os dados da vaga para publicar na plataforma
              </DialogDescription>
            </DialogHeader>
            <CreateJobForm onSuccess={() => setShowCreateJobForm(false)} />
          </DialogContent>
        </Dialog>

        {/* Upgrade Modal */}
        <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Upgrade de Plano</DialogTitle>
              <DialogDescription>
                Aumente seu limite de vagas e desbloqueie novos recursos
              </DialogDescription>
            </DialogHeader>

            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Nenhum plano disponível no momento</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className={`border rounded-lg p-6 text-center ${
                      plan.popular ? 'border-purple-600 bg-purple-50' : 'border-slate-200'
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="bg-purple-600 mb-3 mx-auto">Popular</Badge>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold text-purple-600 mb-4">
                      R$ {plan.price}/mês
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-slate-600">
                      <li className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {plan.description || `${plan.name} Plan`}
                      </li>
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                      }`}
                      onClick={() => handleUpgrade(plan.id, plan.name)}
                      disabled={createCheckoutMutation.isPending}
                    >
                      {createCheckoutMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        'Fazer Upgrade'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
