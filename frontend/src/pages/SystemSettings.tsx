import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Activity, Users, HardDrive, FileText, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import SystemParametersTab from "@/components/admin/system-settings/SystemParametersTab";
import SystemHealthDashboardTab from "@/components/admin/system-settings/SystemHealthDashboardTab";
import PerformanceMonitoringTab from "@/components/admin/system-settings/PerformanceMonitoringTab";
import AdminAccessTab from "@/components/admin/system-settings/AdminAccessTab";
import BackupTab from "@/components/admin/system-settings/BackupTab";
import AuditTrailTab from "@/components/admin/system-settings/AuditTrailTab";

export default function SystemSettings() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("health");

  return (
    <div className="w-full h-full bg-background">
      {/* Header com Botão de Voltar */}
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setLocation('/admin')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Configurações do Sistema</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Gerencie parâmetros técnicos, usuários, backups e monitoramento do sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Saúde</span>
            </TabsTrigger>
            <TabsTrigger value="parameters" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Configurações</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Desempenho</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Acessos</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              <span className="hidden sm:inline">Backup</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Auditoria</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="health" className="space-y-4">
            <SystemHealthDashboardTab />
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <SystemParametersTab />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <PerformanceMonitoringTab />
          </TabsContent>

          <TabsContent value="access" className="space-y-4">
            <AdminAccessTab />
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <BackupTab />
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <AuditTrailTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
