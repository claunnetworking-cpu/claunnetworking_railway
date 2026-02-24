import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

type Step = 'credentials' | 'profile' | 'interests' | 'objectives' | 'terms' | 'success';

export default function CommunitySignup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>('credentials');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    fullName: '',
    mainArea: '',
    experienceYears: 0,
    professionalSummary: '',
    state: '',
    city: '',
    profilePhotoUrl: '',
    interests: [] as string[],
    objectives: [] as Array<{ objectiveType: 'LOOKING_FOR_JOB' | 'CAN_HELP_RESUME' | 'NEED_RESUME_HELP' | 'NEED_INTERVIEW_HELP' | 'CAN_REFER' | 'LOOKING_FOR_SPECIFIC_JOB'; targetArea?: string }>,
    termsAccepted: false,
  });

  const { data: interestsData } = trpc.community.interests.list.useQuery();
  const signupMutation = trpc.community.auth.signup.useMutation();

  const handleNext = () => {
    setError('');
    
    if (step === 'credentials') {
      if (!formData.email || !formData.password || !formData.passwordConfirm) {
        setError('Preencha todos os campos');
        return;
      }
      if (formData.password !== formData.passwordConfirm) {
        setError('As senhas não coincidem');
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
      setStep('profile');
    } else if (step === 'profile') {
      if (!formData.fullName || !formData.mainArea || !formData.state || !formData.city) {
        setError('Preencha todos os campos');
        return;
      }
      setStep('interests');
    } else if (step === 'interests') {
      if (formData.interests.length === 0) {
        setError('Selecione pelo menos um interesse');
        return;
      }
      setStep('objectives');
    } else if (step === 'objectives') {
      if (formData.objectives.length === 0) {
        setError('Selecione pelo menos um objetivo');
        return;
      }
      setStep('terms');
    } else if (step === 'terms') {
      if (!formData.termsAccepted) {
        setError('Você deve aceitar os termos de uso');
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await signupMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        mainArea: formData.mainArea,
        experienceYears: formData.experienceYears,
        professionalSummary: formData.professionalSummary,
        state: formData.state,
        city: formData.city,
        profilePhotoUrl: formData.profilePhotoUrl,
        interests: formData.interests,
        objectives: formData.objectives,
        termsAccepted: formData.termsAccepted,
      });

      if (result.success && result.userId) {
        localStorage.setItem('communityUserId', result.userId);
        setStep('success');
      } else {
        setError(result.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const toggleObjective = (objectiveType: 'LOOKING_FOR_JOB' | 'CAN_HELP_RESUME' | 'NEED_RESUME_HELP' | 'NEED_INTERVIEW_HELP' | 'CAN_REFER' | 'LOOKING_FOR_SPECIFIC_JOB') => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.some(obj => obj.objectiveType === objectiveType)
        ? prev.objectives.filter(obj => obj.objectiveType !== objectiveType)
        : [...prev.objectives, { objectiveType }]
    }));
  };

  const stepTitles = {
    credentials: 'Credenciais',
    profile: 'Perfil Profissional',
    interests: 'Áreas de Interesse',
    objectives: 'Objetivos de Carreira',
    terms: 'Termos de Uso',
    success: 'Conta Criada!'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => setLocation('/community')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-20">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {(['credentials', 'profile', 'interests', 'objectives', 'terms'] as const).map((s, i) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full mx-1 ${
                  ['credentials', 'profile', 'interests', 'objectives', 'terms'].indexOf(step) >= i
                    ? 'bg-purple-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-gray-600 text-sm">
            Passo {['credentials', 'profile', 'interests', 'objectives', 'terms'].indexOf(step) + 1} de 5
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{stepTitles[step]}</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold text-sm">{error}</p>
            </div>
          )}

          {/* Credentials Step */}
          {step === 'credentials' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Senha</label>
                <input
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {/* Profile Step */}
          {step === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Seu Nome"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Área de Atuação</label>
                <input
                  type="text"
                  value={formData.mainArea}
                  onChange={(e) => setFormData({ ...formData, mainArea: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Ex: Tecnologia, Administração"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Anos de Experiência</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="SP"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resumo Profissional</label>
                <textarea
                  value={formData.professionalSummary}
                  onChange={(e) => setFormData({ ...formData, professionalSummary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Fale um pouco sobre sua experiência e objetivos"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Interests Step */}
          {step === 'interests' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">Selecione suas áreas de interesse</p>
              <div className="grid grid-cols-2 gap-3">
                {interestsData?.data?.map((interest: any) => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      formData.interests.includes(interest.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{interest.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Objectives Step */}
          {step === 'objectives' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">Selecione seus objetivos na comunidade</p>
              <div className="space-y-3">
                {[
                  { type: 'LOOKING_FOR_JOB' as const, label: 'Estou procurando emprego' },
                  { type: 'CAN_HELP_RESUME' as const, label: 'Posso ajudar com currículo' },
                  { type: 'NEED_RESUME_HELP' as const, label: 'Preciso de ajuda com currículo' },
                  { type: 'NEED_INTERVIEW_HELP' as const, label: 'Preciso de ajuda para entrevista' },
                  { type: 'CAN_REFER' as const, label: 'Posso indicar pessoa no meu trabalho' },
                  { type: 'LOOKING_FOR_SPECIFIC_JOB' as const, label: 'Procurando vaga em área específica' },
                ].map(obj => (
                  <button
                    key={obj.type}
                    onClick={() => toggleObjective(obj.type)}
                    className={`w-full p-4 rounded-lg border-2 transition text-left ${
                      formData.objectives.some(o => o.objectiveType === obj.type)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{obj.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Terms Step */}
          {step === 'terms' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto text-sm text-gray-700 space-y-4">
                <h3 className="font-bold text-gray-900">Termos de Uso - Comunidade ClaunNetworking</h3>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">1. Código de Conduta</h4>
                  <p>A comunidade é um espaço profissional e acolhedor. É proibido:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Assédio, xingamentos ou ofensas de qualquer tipo</li>
                    <li>Compartilhamento de contatos pessoais (WhatsApp, email, telefone)</li>
                    <li>Anúncios de vagas externas (exceto administrador)</li>
                    <li>Propaganda de cursos ou mentorias não autorizadas</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">2. Chat e Conexões</h4>
                  <p>Você só pode conversar com pessoas que aceitaram sua solicitação de conexão. Mensagens inadequadas resultarão em bloqueio automático e banimento.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3. Moderação</h4>
                  <p>Violações serão rastreadas e podem resultar em advertência, suspensão ou banimento permanente da comunidade.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4. Uso Exclusivo</h4>
                  <p>A comunidade é para fins de carreira e networking profissional apenas.</p>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-gray-700">
                  Aceito os termos de uso e entendo as regras da comunidade
                </span>
              </label>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta Criada com Sucesso!</h2>
              <p className="text-gray-600 mb-8">Bem-vindo à Comunidade ClaunNetworking</p>
              <button
                onClick={() => setLocation('/community/feed')}
                className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
              >
                Ir para o Feed
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step !== 'success' && (
            <div className="flex gap-4 mt-8">
              {step !== 'credentials' && (
                <button
                  onClick={() => {
                    const steps: Step[] = ['credentials', 'profile', 'interests', 'objectives', 'terms'];
                    const currentIndex = steps.indexOf(step);
                    if (currentIndex > 0) setStep(steps[currentIndex - 1]);
                  }}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {step === 'terms' ? 'Criar Conta' : 'Próximo'}
                {step !== 'terms' && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
