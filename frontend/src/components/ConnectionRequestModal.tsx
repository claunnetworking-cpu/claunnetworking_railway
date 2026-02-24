import { useState } from 'react';
import { X, Wifi, Check } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface ConnectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
}

const CONNECTION_OBJECTIVES = [
  {
    id: 'LOOKING_FOR_JOB',
    label: 'Procurando emprego',
    icon: '🔍',
    description: 'Estou buscando oportunidades de trabalho',
  },
  {
    id: 'CAN_HELP_RESUME',
    label: 'Posso ajudar com currículo',
    icon: '✏️',
    description: 'Posso revisar e melhorar seu currículo',
  },
  {
    id: 'NEED_RESUME_HELP',
    label: 'Preciso de ajuda com currículo',
    icon: '📄',
    description: 'Preciso de feedback no meu currículo',
  },
  {
    id: 'NEED_INTERVIEW_HELP',
    label: 'Preciso de ajuda para entrevista',
    icon: '🎯',
    description: 'Quero treinar para entrevistas',
  },
  {
    id: 'CAN_REFER',
    label: 'Posso indicar na minha empresa',
    icon: '🤝',
    description: 'Tenho vagas abertas na minha empresa',
  },
  {
    id: 'LOOKING_FOR_SPECIFIC_JOB',
    label: 'Procurando vaga em área específica',
    icon: '💼',
    description: 'Estou buscando em uma área específica',
  },
];

export default function ConnectionRequestModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
}: ConnectionRequestModalProps) {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendConnectionMutation = trpc.community.connections.sendRequest.useMutation();

  const toggleObjective = (objectiveId: string) => {
    setSelectedObjectives((prev) =>
      prev.includes(objectiveId)
        ? prev.filter((id) => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  const handleSendRequest = async () => {
    if (selectedObjectives.length === 0) {
      toast.error('Selecione pelo menos um objetivo');
      return;
    }

    setIsLoading(true);
    try {
      const currentUserId = localStorage.getItem('communityUserId');
      if (!currentUserId) {
        toast.error('Você precisa estar logado');
        return;
      }

      const result = await sendConnectionMutation.mutateAsync({
        userId1: currentUserId,
        userId2: targetUserId,
        objectives: selectedObjectives,
      });

      if (result.success) {
        toast.success('Solicitação de conexão enviada!');
        setSelectedObjectives([]);
        onClose();
      } else {
        toast.error(result.error || 'Erro ao enviar solicitação');
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error('Erro ao enviar solicitação de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Wifi size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Conectar com {targetUserName}</h2>
              <p className="text-purple-100 text-sm">Selecione como você pode ajudar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm">
            Selecione um ou mais objetivos para sua conexão. Isso ajudará a pessoa a entender como você pode se ajudarem.
          </p>

          <div className="space-y-3">
            {CONNECTION_OBJECTIVES.map((objective) => (
              <button
                key={objective.id}
                onClick={() => toggleObjective(objective.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedObjectives.includes(objective.id)
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-1">{objective.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{objective.label}</div>
                    <div className="text-sm text-gray-600">{objective.description}</div>
                  </div>
                  {selectedObjectives.includes(objective.id) && (
                    <div className="bg-purple-600 text-white p-1 rounded-full mt-1">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendRequest}
            disabled={isLoading || selectedObjectives.length === 0}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
          >
            <Wifi size={18} />
            {isLoading ? 'Enviando...' : 'Conectar'}
          </button>
        </div>
      </div>
    </div>
  );
}
