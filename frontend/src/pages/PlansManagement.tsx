import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Plan {
  id: string;
  code: string;
  categoryId: string;
  name: string;
  callToAction?: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  features: string[];
  tier: 'starter' | 'professional' | 'premium';
  isPopular: boolean;
  status: 'active' | 'inactive' | 'archived';
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function PlansManagement() {
  const [, navigate] = useLocation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    callToAction: '',
    description: '',
    price: '',
    originalPrice: '',
    duration: '',
    features: '',
    tier: 'starter' as 'starter' | 'professional' | 'premium',
    isPopular: false,
  });

  // Fetch categories
  const { data: categoriesData } = trpc.products.getCategories.useQuery();
  const { data: allPlans } = trpc.products.getAllAdmin.useQuery();

  // Mutations
  const createPlanMutation = trpc.products.create.useMutation();
  const updatePlanMutation = trpc.products.update.useMutation();
  const deletePlanMutation = trpc.products.delete.useMutation();
  const deactivatePlanMutation = trpc.products.deactivate.useMutation();

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData as Category[]);
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    }
  }, [categoriesData]);

  useEffect(() => {
    if (allPlans) {
      const filtered = selectedCategory
        ? allPlans.filter((p: any) => p.categoryId === selectedCategory)
        : allPlans;
      setPlans(filtered);
    }
  }, [allPlans, selectedCategory]);

  const handleOpenDialog = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        callToAction: plan.callToAction || '',
        description: plan.description,
        price: plan.price.toString(),
        originalPrice: plan.originalPrice?.toString() || '',
        duration: plan.duration || '',
        features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
        tier: plan.tier,
        isPopular: plan.isPopular,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        callToAction: '',
        description: '',
        price: '',
        originalPrice: '',
        duration: '',
        features: '',
        tier: 'starter',
        isPopular: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSavePlan = async () => {
    if (!formData.name || !formData.description || !formData.price || !selectedCategory) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const features = formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f);

      if (editingPlan) {
        await updatePlanMutation.mutateAsync({
          id: editingPlan.id,
          name: formData.name,
          callToAction: formData.callToAction,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: formData.duration,
          features,
          isPopular: formData.isPopular,
        });
        toast.success('Plano atualizado com sucesso!');
      } else {
        await createPlanMutation.mutateAsync({
          categoryId: selectedCategory,
          name: formData.name,
          callToAction: formData.callToAction,
          description: formData.description,
          price: parseFloat(formData.price),
          duration: formData.duration,
          features,
          tier: formData.tier,
          isPopular: formData.isPopular,
        });
        toast.success('Plano criado com sucesso!');
      }

      setIsDialogOpen(false);
      // Refetch plans
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar plano');
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este plano?')) return;

    try {
      await deletePlanMutation.mutateAsync({ id });
      toast.success('Plano deletado com sucesso!');
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar plano');
    }
  };

  const handleDeactivatePlan = async (id: string) => {
    try {
      await deactivatePlanMutation.mutateAsync({ id });
      toast.success('Plano inativado com sucesso!');
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao inativar plano');
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'starter':
        return 'bg-blue-100 text-blue-800';
      case 'professional':
        return 'bg-purple-100 text-purple-800';
      case 'premium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'starter':
        return 'Iniciante';
      case 'professional':
        return 'Profissional';
      case 'premium':
        return 'Premium';
      default:
        return tier;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/admin/commercial')}
              className="flex items-center gap-2 text-white hover:opacity-80 transition mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h1 className="text-3xl font-bold">Gestão de Planos</h1>
            <p className="text-purple-100 mt-1">Crie e gerencie seus planos de serviços</p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Plano
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Filtrar por Categoria</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-lg font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    R$ {(typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price).toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierColor(plan.tier)}`}>
                    {getTierLabel(plan.tier)}
                  </span>
                  {plan.isPopular && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
              </div>

              {plan.callToAction && (
                <p className="text-sm text-gray-600 mb-2 italic">{plan.callToAction}</p>
              )}

              <p className="text-sm text-gray-700 mb-4">{plan.description}</p>

              {plan.duration && (
                <p className="text-xs text-gray-500 mb-3">⏱️ Duração: {plan.duration}</p>
              )}

              {plan.features && plan.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Benefícios:</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature: any, idx: number) => (
                      <li key={idx} className="text-xs text-gray-600">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t pt-4 flex gap-2">
                <Button
                  onClick={() => handleOpenDialog(plan)}
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDeactivatePlan(plan.id)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  title={plan.status === 'active' ? 'Inativar' : 'Ativar'}
                >
                  {plan.status === 'active' ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={() => handleDeletePlan(plan.id)}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {plan.status !== 'active' && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  Status: {plan.status === 'inactive' ? 'Inativo' : 'Arquivado'}
                </div>
              )}
            </Card>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum plano encontrado para esta categoria</p>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-5 h-5" />
              Criar Primeiro Plano
            </Button>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Editar Plano' : 'Novo Plano'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Plano Start"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Call to Action</label>
              <Input
                value={formData.callToAction}
                onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
                placeholder="Ex: Ganhe autoridade e alcance mais clientes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o plano"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Preço (R$) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preço Original (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duração</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ex: 30 dias, 1 mês, Único"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="starter">Iniciante</option>
                <option value="professional">Profissional</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Benefícios (um por linha)</label>
              <Textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Ex: Story de apresentação&#10;Divulgação do perfil&#10;Link direto para contato"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPopular"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isPopular" className="text-sm font-medium">
                Marcar como Popular
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSavePlan}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={createPlanMutation.isPending || updatePlanMutation.isPending}
              >
                {createPlanMutation.isPending || updatePlanMutation.isPending
                  ? 'Salvando...'
                  : 'Salvar'}
              </Button>
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
