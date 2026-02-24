import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, X } from "lucide-react";
import { useState } from "react";

export default function CompanyManagement() {
  const [selectedTab, setSelectedTab] = useState("jobs");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Mock data - será substituído por dados reais da API
  const jobRequests = [
    {
      id: "1",
      company: "Tech Solutions Inc",
      companyId: "comp_123",
      title: "Senior Developer",
      type: "vaga_com_link",
      link: "https://example.com/job/123",
      status: "pending",
      createdAt: "2026-02-22T10:30:00Z",
      submittedData: {
        jobTitle: "Senior Developer",
        link: "https://example.com/job/123",
      },
    },
    {
      id: "2",
      company: "Digital Agency",
      companyId: "comp_456",
      title: "Product Manager",
      type: "vaga_sem_link",
      status: "analysis",
      createdAt: "2026-02-21T14:15:00Z",
      submittedData: {
        jobTitle: "Product Manager",
        city: "São Paulo",
        state: "SP",
        modality: "remoto",
        level: "pleno",
        salary: "R$ 8.000 - R$ 12.000",
        description: "Procuramos um Product Manager experiente...",
        benefits: "Vale refeição, Vale transporte, Plano de saúde",
        applicationDeadline: "2026-03-15",
        applicationType: "email",
        applicationEmail: "jobs@agency.com",
      },
    },
    {
      id: "3",
      company: "Startup XYZ",
      companyId: "comp_789",
      title: "Frontend Engineer",
      type: "vaga_com_link",
      link: "https://invalid-link.com",
      status: "rejected",
      rejectionReason: "Link inválido ou expirado. Por favor, verifique o URL.",
      createdAt: "2026-02-20T09:00:00Z",
      submittedData: {
        jobTitle: "Frontend Engineer",
        link: "https://invalid-link.com",
      },
    },
  ];

  const mentorshipRequests = [
    {
      id: "m1",
      company: "Consulting Group",
      companyId: "comp_101",
      title: "Business Strategy Mentorship",
      status: "pending",
      createdAt: "2026-02-22T11:20:00Z",
    },
  ];

  const courseRequests = [
    {
      id: "c1",
      company: "Education Plus",
      companyId: "comp_202",
      title: "Advanced React Course",
      status: "approved",
      createdAt: "2026-02-19T08:45:00Z",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Pendente</Badge>;
      case "analysis":
        return <Badge className="bg-blue-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Em Análise</Badge>;
      case "approved":
        return <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Aprovado</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 flex items-center gap-1"><X className="w-3 h-3" /> Rejeitado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const handleApprove = (requestId: string) => {
    console.log("Aprovar:", requestId);
    // Chamar API para aprovar
  };

  const handleReject = (requestId: string) => {
    setSelectedRequest(requestId);
    setShowRejectionModal(true);
  };

  const submitRejection = () => {
    console.log("Rejeitar:", selectedRequest, "Motivo:", rejectionReason);
    // Chamar API para rejeitar com motivo
    setShowRejectionModal(false);
    setRejectionReason("");
    setSelectedRequest(null);
  };

  const renderJobDetails = (request: typeof jobRequests[0]) => {
    return (
      <div className="space-y-3 mt-4 p-4 bg-slate-50 rounded-lg">
        <div>
          <p className="text-xs text-slate-600">Tipo de Vaga</p>
          <p className="font-medium">{request.type === "vaga_com_link" ? "Com Link Público" : "Sem Link"}</p>
        </div>
        {request.type === "vaga_com_link" ? (
          <div>
            <p className="text-xs text-slate-600">Link</p>
            <a href={request.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline break-all">
              {request.link}
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-600">Cidade</p>
                <p className="font-medium">{request.submittedData.city}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Estado</p>
                <p className="font-medium">{request.submittedData.state}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Modalidade</p>
                <p className="font-medium capitalize">{request.submittedData.modality}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Nível</p>
                <p className="font-medium capitalize">{request.submittedData.level}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-600">Descrição</p>
              <p className="text-sm">{request.submittedData.description}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Benefícios</p>
              <p className="text-sm">{request.submittedData.benefits}</p>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Gestão de Empresas</h1>
          <p className="text-slate-600">Aprove ou rejeite pedidos de publicação das empresas</p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200">
            <TabsTrigger value="jobs">Divulgação de Vagas</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorias</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <div className="space-y-4">
              {jobRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>{request.title}</CardTitle>
                        <CardDescription>
                          {request.company} • Criado em {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderJobDetails(request)}

                    {request.status === "rejected" && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-900">Motivo da Rejeição:</p>
                          <p className="text-sm text-red-800">{request.rejectionReason}</p>
                        </div>
                      </div>
                    )}

                    {request.status === "pending" && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mentorship Tab */}
          <TabsContent value="mentorship" className="space-y-4">
            <div className="space-y-4">
              {mentorshipRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>{request.title}</CardTitle>
                        <CardDescription>
                          {request.company} • Criado em {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 pt-4">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(request.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <div className="space-y-4">
              {courseRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>{request.title}</CardTitle>
                        <CardDescription>
                          {request.company} • Criado em {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 pt-4">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(request.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Rejeitar Pedido</CardTitle>
              <CardDescription>Forneça um motivo para a rejeição</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Motivo da Rejeição</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ex: Link inválido, e-mail não funciona, informações incompletas..."
                  className="w-full mt-2 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={submitRejection}
                  disabled={!rejectionReason.trim()}
                >
                  Rejeitar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
