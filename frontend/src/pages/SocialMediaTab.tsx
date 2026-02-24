import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Instagram, Facebook, Linkedin, Twitter, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface SocialMetric {
  id: string;
  platform: string;
  visualizations: number;
  newFollowers: number;
  sharedContent: number;
  createdAt: Date;
  updatedAt: Date;
}

const PLATFORMS = [
  { name: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { name: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { name: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
];

export default function SocialMediaTab() {
  const [metrics, setMetrics] = useState<SocialMetric[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    visualizations: 0,
    newFollowers: 0,
    sharedContent: 0,
  });

  const { data: allMetrics = [] } = trpc.socialMedia.getAll.useQuery();
  const updateMutation = trpc.socialMedia.update.useMutation();
  const deleteMutation = trpc.socialMedia.delete.useMutation();
  const createMutation = trpc.socialMedia.create.useMutation();

  useEffect(() => {
    setMetrics(allMetrics as SocialMetric[]);
  }, [allMetrics]);

  const handleEdit = (metric: SocialMetric) => {
    setEditingId(metric.id);
    setFormData({
      platform: metric.platform,
      visualizations: metric.visualizations,
      newFollowers: metric.newFollowers,
      sharedContent: metric.sharedContent,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await updateMutation.mutateAsync({
        id: editingId,
        visualizations: formData.visualizations,
        newFollowers: formData.newFollowers,
        sharedContent: formData.sharedContent,
      });
      // Recarregar dados após salvar
      await trpc.useUtils().socialMedia.getAll.invalidate();
      setEditingId(null);
      alert('Métricas atualizadas com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar métricas.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta métrica?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        // Recarregar dados após deletar
        await trpc.useUtils().socialMedia.getAll.invalidate();
        alert('Métrica deletada com sucesso!');
      } catch (error) {
        alert('Erro ao deletar métrica.');
      }
    }
  };

  const handleAddNew = async () => {
    if (!formData.platform) {
      alert('Selecione uma plataforma.');
      return;
    }
    try {
      await createMutation.mutateAsync({
        platform: formData.platform,
        visualizations: formData.visualizations,
        newFollowers: formData.newFollowers,
        sharedContent: formData.sharedContent,
      });
      // Recarregar dados após criar
      await trpc.useUtils().socialMedia.getAll.invalidate();
      setFormData({
        platform: '',
        visualizations: 0,
        newFollowers: 0,
        sharedContent: 0,
      });
      alert('Métrica criada com sucesso!');
    } catch (error) {
      alert('Erro ao criar métrica.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Redes Sociais</h2>
        <p className="text-sm text-gray-600 mt-1">Gerencie as métricas de suas redes sociais</p>
      </div>

      {/* Tabela de Métricas */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Atuais</CardTitle>
          <CardDescription>Atualize os dados de suas redes sociais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Plataforma</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Visualizações</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Novos Seguidores</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Conteúdo Compartilhado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => {
                  const isEditing = editingId === metric.id;
                  const platformInfo = PLATFORMS.find(p => p.name === metric.platform);
                  const Icon = platformInfo?.icon || Instagram;

                  return (
                    <tr key={metric.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${platformInfo?.color}`} />
                          <span className="font-medium text-gray-900">{platformInfo?.label || metric.platform}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={formData.visualizations}
                            onChange={(e) => setFormData({ ...formData, visualizations: parseInt(e.target.value) })}
                            className="w-32"
                          />
                        ) : (
                          <span className="text-gray-900">{metric.visualizations.toLocaleString('pt-BR')}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={formData.newFollowers}
                            onChange={(e) => setFormData({ ...formData, newFollowers: parseInt(e.target.value) })}
                            className="w-32"
                          />
                        ) : (
                          <span className="text-gray-900">{metric.newFollowers.toLocaleString('pt-BR')}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={formData.sharedContent}
                            onChange={(e) => setFormData({ ...formData, sharedContent: parseInt(e.target.value) })}
                            className="w-32"
                          />
                        ) : (
                          <span className="text-gray-900">{metric.sharedContent.toLocaleString('pt-BR')}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                onClick={handleSave}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => setEditingId(null)}
                                size="sm"
                                variant="outline"
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleEdit(metric)}
                                size="sm"
                                variant="outline"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(metric.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {metrics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma métrica cadastrada. Adicione uma nova plataforma abaixo.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adicionar Nova Métrica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Nova Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Selecione...</option>
                {PLATFORMS.map(p => (
                  <option key={p.name} value={p.name}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visualizações</label>
              <Input
                type="number"
                value={formData.visualizations}
                onChange={(e) => setFormData({ ...formData, visualizations: parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Novos Seguidores</label>
              <Input
                type="number"
                value={formData.newFollowers}
                onChange={(e) => setFormData({ ...formData, newFollowers: parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo Compartilhado</label>
              <Input
                type="number"
                value={formData.sharedContent}
                onChange={(e) => setFormData({ ...formData, sharedContent: parseInt(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAddNew}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
