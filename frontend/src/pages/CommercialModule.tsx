import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, ArrowLeft, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import ClientListTab from "@/components/admin/commercial/ClientListTab";
import SalesTab from "@/components/admin/commercial/SalesTab";
import SocialMediaTab from "@/pages/SocialMediaTab";


export default function CommercialModule() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("clients");

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
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-foreground">Módulo Comercial</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Gerencie clientes e performance de vendas
        </p>
      </div>

      {/* Tabs */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Vendas</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Redes Sociais</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="clients" className="space-y-4">
            <ClientListTab />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <SalesTab />
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <SocialMediaTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
