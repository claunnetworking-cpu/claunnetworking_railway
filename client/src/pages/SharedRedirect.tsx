import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

export default function SharedRedirect() {
  const [route, params] = useRoute('/shared/:shareToken');
  const [redirecting, setRedirecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shareQuery = trpc.whatsapp.getShare.useQuery(
    { shareToken: params?.shareToken || '' },
    { enabled: !!params?.shareToken }
  );

  const recordClickMutation = trpc.whatsapp.recordClick.useMutation();
  const jobQuery = trpc.jobs.getById.useQuery(
    { id: shareQuery.data?.resourceId || '' },
    { enabled: shareQuery.data?.resourceType === 'job' && !!shareQuery.data?.resourceId }
  );
  const courseQuery = trpc.courses.getById.useQuery(
    { id: shareQuery.data?.resourceId || '' },
    { enabled: shareQuery.data?.resourceType === 'course' && !!shareQuery.data?.resourceId }
  );

  useEffect(() => {
    if (!params?.shareToken) {
      setError('Token de compartilhamento inválido');
      setRedirecting(false);
      return;
    }

    if (shareQuery.isLoading) {
      return;
    }

    if (shareQuery.error || !shareQuery.data) {
      setError('Link expirado ou inválido');
      setRedirecting(false);
      return;
    }

    const share = shareQuery.data;

    // Registrar clique e redirecionar
    const handleRedirect = async () => {
      try {
        const sessionId = Math.random().toString(36).substring(7);
        sessionStorage.setItem('whatsappSessionId', sessionId);

        // Registrar clique
        await recordClickMutation.mutateAsync({
          shareToken: params.shareToken,
          sessionId,
          userAgent: navigator.userAgent,
        });

        // Redirecionar para a vaga/curso
        if (share.resourceType === 'job') {
          if (jobQuery.data?.link) {
            // Marcar como conversão quando clicar no link externo
            await recordClickMutation.mutateAsync({
              shareToken: params.shareToken,
              sessionId,
              converted: true,
            });
            window.location.href = jobQuery.data.link;
          } else {
            setError('Vaga não encontrada');
            setRedirecting(false);
          }
        } else {
          if (courseQuery.data?.link) {
            // Marcar como conversão quando clicar no link externo
            await recordClickMutation.mutateAsync({
              shareToken: params.shareToken,
              sessionId,
              converted: true,
            });
            window.location.href = courseQuery.data.link;
          } else {
            setError('Curso não encontrado');
            setRedirecting(false);
          }
        }
      } catch (err) {
        console.error('Erro ao redirecionar:', err);
        setError('Erro ao processar compartilhamento');
        setRedirecting(false);
      }
    };

    if (share.resourceType === 'job' && jobQuery.data) {
      handleRedirect();
    } else if (share.resourceType === 'course' && courseQuery.data) {
      handleRedirect();
    } else if (!jobQuery.isLoading && !courseQuery.isLoading) {
      setError('Recurso não encontrado');
      setRedirecting(false);
    }
  }, [shareQuery.data, shareQuery.isLoading, shareQuery.error, params?.shareToken, jobQuery.data, courseQuery.data, jobQuery.isLoading, courseQuery.isLoading, recordClickMutation]);

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Redirecionando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Voltar para Home
          </a>
        </div>
      </div>
    );
  }

  return null;
}
