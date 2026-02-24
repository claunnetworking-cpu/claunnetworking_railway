import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, CreditCard, History, Clock, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import FinancialDashboardTab from "@/components/admin/financial/FinancialDashboardTab";

import TransactionHistoryTab from "@/components/admin/financial/TransactionHistoryTab";
import AccountsReceivableTab from "@/components/admin/financial/AccountsReceivableTab";

export default function FinancialModule() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

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
          <BarChart3 className="w-6 h-6 text-green-600" />
          <h1 className="text-3xl font-bold text-foreground">Módulo Financeiro</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Gerencie transações, contas a receber e próximos pagamentos
        </p>
      </div>

      {/* Tabs */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>

            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="receivable" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">A Receber</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="dashboard" className="space-y-4">
            <FinancialDashboardTab />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <TransactionHistoryTab />
          </TabsContent>

          <TabsContent value="receivable" className="space-y-4">
            <AccountsReceivableTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
