import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Backup {
  id: string;
  backupName: string;
  backupType: "manual" | "scheduled" | "automatic";
  status: "pending" | "in_progress" | "completed" | "failed";
  fileSize?: number;
  createdAt: string;
  completedAt?: string;
}

interface BackupSchedule {
  id: string;
  scheduleName: string;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  hour: number;
  minute: number;
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
}

const MOCK_BACKUPS: Backup[] = [
  {
    id: "1",
    backupName: "Backup Manual - 20/02/2026",
    backupType: "manual",
    status: "completed",
    fileSize: 524288000,
    createdAt: "2026-02-20T10:30:00",
    completedAt: "2026-02-20T10:45:00",
  },
  {
    id: "2",
    backupName: "Backup Automático - 19/02/2026",
    backupType: "automatic",
    status: "completed",
    fileSize: 512000000,
    createdAt: "2026-02-19T02:00:00",
    completedAt: "2026-02-19T02:15:00",
  },
  {
    id: "3",
    backupName: "Backup Manual - 18/02/2026",
    backupType: "manual",
    status: "failed",
    createdAt: "2026-02-18T15:00:00",
  },
];

const MOCK_SCHEDULES: BackupSchedule[] = [
  {
    id: "1",
    scheduleName: "Backup Diário",
    frequency: "daily",
    hour: 2,
    minute: 0,
    isActive: true,
    lastRun: "2026-02-20T02:00:00",
    nextRun: "2026-02-21T02:00:00",
  },
  {
    id: "2",
    scheduleName: "Backup Semanal",
    frequency: "weekly",
    hour: 3,
    minute: 0,
    isActive: true,
    lastRun: "2026-02-16T03:00:00",
    nextRun: "2026-02-23T03:00:00",
  },
];

export default function BackupTab() {
  const [backups, setBackups] = useState<Backup[]>(MOCK_BACKUPS);
  const [schedules, setSchedules] = useState<BackupSchedule[]>(MOCK_SCHEDULES);
  const [showNewSchedule, setShowNewSchedule] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "✅ Concluído";
      case "in_progress":
        return "⏳ Em Progresso";
      case "pending":
        return "⏸️ Pendente";
      case "failed":
        return "❌ Falhou";
      default:
        return "Status";
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreateBackup = () => {
    const newBackup: Backup = {
      id: String(backups.length + 1),
      backupName: `Backup Manual - ${new Date().toLocaleDateString("pt-BR")}`,
      backupType: "manual",
      status: "in_progress",
      createdAt: new Date().toISOString(),
    };
    setBackups([newBackup, ...backups]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Backup</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie backups manuais e agendados do sistema
          </p>
        </div>
        <Button onClick={handleCreateBackup} className="gap-2">
          <Plus className="w-4 h-4" />
          Criar Backup Manual
        </Button>
      </div>

      {/* Tabs de Backup e Agendamento */}
      <div className="space-y-6">
        {/* BACKUPS */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">Histórico de Backups</h3>
          <div className="space-y-3">
            {backups.map((backup) => (
              <Card key={backup.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Cabeçalho */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-foreground">
                            {backup.backupName}
                          </h4>
                          <Badge className={getStatusColor(backup.status)}>
                            {getStatusLabel(backup.status)}
                          </Badge>
                          <Badge variant="outline">{backup.backupType}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted p-3 rounded-md">
                      <div>
                        <p className="text-xs text-muted-foreground">Criado em</p>
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(backup.createdAt)}
                        </p>
                      </div>
                      {backup.completedAt && (
                        <div>
                          <p className="text-xs text-muted-foreground">Concluído em</p>
                          <p className="text-sm font-medium text-foreground">
                            {formatDate(backup.completedAt)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Tamanho</p>
                        <p className="text-sm font-medium text-foreground">
                          {formatFileSize(backup.fileSize)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tipo</p>
                        <p className="text-sm font-medium text-foreground capitalize">
                          {backup.backupType}
                        </p>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-2 justify-end">
                      {backup.status === "completed" && (
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      )}
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AGENDAMENTOS */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-foreground">Agendamentos de Backup</h3>
            <Button
              size="sm"
              onClick={() => setShowNewSchedule(!showNewSchedule)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Agendamento
            </Button>
          </div>

          {/* Formulário de novo agendamento */}
          {showNewSchedule && (
            <Card className="border-primary/20 bg-primary/5 mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Criar Novo Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Nome do Agendamento" />
                  <select className="px-3 py-2 border border-border rounded-md">
                    <option value="">Selecione a Frequência</option>
                    <option value="daily">Diariamente</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="monthly">Mensalmente</option>
                    <option value="custom">Customizado</option>
                  </select>
                  <Input type="time" placeholder="Hora" />
                  <Input type="number" placeholder="Dias de Retenção" defaultValue="30" />
                </div>
                <div className="flex gap-2">
                  <Button variant="default">Criar</Button>
                  <Button variant="outline" onClick={() => setShowNewSchedule(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de agendamentos */}
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Cabeçalho */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-foreground">
                            {schedule.scheduleName}
                          </h4>
                          <Badge
                            variant={schedule.isActive ? "default" : "secondary"}
                            className={
                              schedule.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {schedule.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {schedule.frequency}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted p-3 rounded-md">
                      <div>
                        <p className="text-xs text-muted-foreground">Horário</p>
                        <p className="text-sm font-medium text-foreground">
                          {String(schedule.hour).padStart(2, "0")}:
                          {String(schedule.minute).padStart(2, "0")}
                        </p>
                      </div>
                      {schedule.lastRun && (
                        <div>
                          <p className="text-xs text-muted-foreground">Último Backup</p>
                          <p className="text-sm font-medium text-foreground">
                            {formatDate(schedule.lastRun)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Próximo Backup</p>
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(schedule.nextRun)}
                        </p>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Informações de Retenção */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Política de Retenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-foreground">
            <li>• Backups manuais são retidos por 30 dias por padrão</li>
            <li>• Backups automáticos são retidos por 7 dias</li>
            <li>• Você pode customizar o período de retenção para cada agendamento</li>
            <li>• Backups expirados são automaticamente deletados</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
