import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Lock, Unlock } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  accessLevel: "super_admin" | "admin" | "moderator" | "viewer";
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const MOCK_ADMINS: AdminUser[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@claunnetworking.com",
    accessLevel: "super_admin",
    isActive: true,
    lastLogin: "2026-02-20T10:30:00",
    createdAt: "2026-01-01T00:00:00",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@claunnetworking.com",
    accessLevel: "admin",
    isActive: true,
    lastLogin: "2026-02-19T15:45:00",
    createdAt: "2026-01-15T00:00:00",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@claunnetworking.com",
    accessLevel: "moderator",
    isActive: false,
    createdAt: "2026-02-01T00:00:00",
  },
];

const ACCESS_LEVELS = {
  super_admin: {
    label: "Super Admin",
    description: "Acesso total ao sistema",
    color: "bg-red-100 text-red-800",
  },
  admin: {
    label: "Admin",
    description: "Acesso administrativo completo",
    color: "bg-orange-100 text-orange-800",
  },
  moderator: {
    label: "Moderador",
    description: "Moderação de conteúdo",
    color: "bg-blue-100 text-blue-800",
  },
  viewer: {
    label: "Visualizador",
    description: "Apenas leitura",
    color: "bg-gray-100 text-gray-800",
  },
};

export default function AdminAccessTab() {
  const [admins, setAdmins] = useState<AdminUser[]>(MOCK_ADMINS);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleToggleActive = (id: string) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === id ? { ...admin, isActive: !admin.isActive } : admin
      )
    );
  };

  const handleDelete = (id: string) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestão de Acessos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie usuários administradores e seus níveis de acesso
          </p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Admin
        </Button>
      </div>

      {/* Formulário de novo admin */}
      {showNewForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Adicionar Novo Administrador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Nome Completo" />
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Senha" />
              <select className="px-3 py-2 border border-border rounded-md">
                <option value="">Selecione o Nível de Acesso</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderador</option>
                <option value="viewer">Visualizador</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="default">Criar</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de admins */}
      <div className="space-y-3">
        {admins.map((admin) => (
          <Card key={admin.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{admin.name}</h3>
                      <Badge
                        className={
                          ACCESS_LEVELS[admin.accessLevel]?.color ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {ACCESS_LEVELS[admin.accessLevel]?.label || "Desconhecido"}
                      </Badge>
                      <Badge
                        variant={admin.isActive ? "default" : "secondary"}
                        className={
                          admin.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {admin.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{admin.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {ACCESS_LEVELS[admin.accessLevel]?.description}
                    </p>
                  </div>
                </div>

                {/* Informações de acesso */}
                <div className="grid grid-cols-2 gap-4 bg-muted p-3 rounded-md">
                  <div>
                    <p className="text-xs text-muted-foreground">Criado em</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(admin.createdAt)}
                    </p>
                  </div>
                  {admin.lastLogin && (
                    <div>
                      <p className="text-xs text-muted-foreground">Último acesso</p>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(admin.lastLogin)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(admin.id)}
                    className="gap-2"
                  >
                    {admin.isActive ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        Ativar
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(admin.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela de Permissões por Nível */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permissões</CardTitle>
          <CardDescription>
            Visualize as permissões de cada nível de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Permissão
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">
                    Super Admin
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">
                    Admin
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">
                    Moderador
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">
                    Visualizador
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Gerenciar Configurações",
                  "Gerenciar Usuários",
                  "Gerenciar Vagas",
                  "Gerenciar Cursos",
                  "Visualizar Relatórios",
                  "Gerenciar Backups",
                  "Visualizar Auditoria",
                ].map((permission, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-4 text-foreground">{permission}</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">
                      {idx < 5 ? "✅" : "❌"}
                    </td>
                    <td className="text-center py-3 px-4">
                      {idx === 4 ? "✅" : "❌"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
