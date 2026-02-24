import { MapPin, Clock, Briefcase, Users, Share2, Loader2 } from 'lucide-react';
import { Vaga, Curso } from '@/lib/mockData';
import { trpc } from '@/lib/trpc';
import { useState } from 'react';
import { toast } from 'sonner';

interface JobCardProps {
  item: Vaga | Curso;
  type: 'job' | 'course';
}

export default function JobCard({ item, type }: JobCardProps) {
  const [sharingLoading, setSharingLoading] = useState(false);
  const createShareMutation = trpc.whatsapp.createShare.useMutation();
  const recordJobClickMutation = trpc.stats.recordJobClick.useMutation();
  const recordWhatsappClickMutation = trpc.whatsapp.recordClick.useMutation();
  const isJob = type === 'job';
  const job = item as Vaga;
  const course = item as Curso;
  
  const link = isJob ? (job as any).link : (course as any).link;
  const hasValidLink = link && link.trim() !== '';

  const handleJobClick = async () => {
    if (isJob) {
      // Registrar clique no banco de dados
      recordJobClickMutation.mutate({
        jobId: job.id,
        jobTitle: (job as any).titulo || (job as any).title,
        sessionId: localStorage.getItem('sessionId') || undefined,
        userAgent: navigator.userAgent,
      });
    }
    // Redirecionar para o link externo
    if (link && link.trim()) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Link indisponível para esta vaga');
    }
  };

  const handleWhatsappShare = async () => {
    setSharingLoading(true);
    try {
      const share = await createShareMutation.mutateAsync({
        resourceType: type,
        resourceId: item.id,
      });

      // Registrar o clique de compartilhamento WhatsApp
      recordWhatsappClickMutation.mutate({
        shareToken: share.shareToken,
        sessionId: localStorage.getItem('sessionId') || undefined,
        userAgent: navigator.userAgent,
      });

      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/shared/${share.shareToken}`;
      const text = isJob
        ? `Vaga: ${job.titulo}\n${shareUrl}`
        : `Curso: ${course.titulo}\n${shareUrl}`;
      
      // Redirecionar para WhatsApp com o texto pronto
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.location.href = whatsappUrl;
      toast.success('Link gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast.error('Erro ao gerar link de compartilhamento');
    } finally {
      setSharingLoading(false);
    }
  };

  // Formatar data de cadastro
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 flex-1">
            {isJob ? job.titulo : course.titulo}
          </h3>
          <div className="flex gap-2 flex-wrap justify-end">
            {isJob && job.pcd && (
              <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                <span className="font-bold">PCD</span>
              </span>
            )}
            {!isJob && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                Gratis
              </span>
            )}
          </div>
        </div>
        {!isJob && (
          <p className="text-gray-600 text-sm md:text-base">
            {course.instituicao}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 md:gap-4 mb-6 text-sm md:text-base">
        {isJob ? (
          <>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-secondary" />
              <span>{job.estado}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase size={16} className="text-secondary" />
              <span className="capitalize">{job.modalidade}</span>
              {job.modalidade && job.modalidade.toLowerCase() === 'remoto' && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Remoto</span>
              )}
            </div>

            {job.dataCadastro && (
              <div className="text-xs text-gray-400">
                {formatDate(job.dataCadastro)}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} className="text-secondary" />
              <span>{course.horas}h</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase size={16} className="text-secondary" />
              <span className="capitalize">{course.modalidade}</span>
            </div>
            {course.dataCadastro && (
              <div className="text-xs text-gray-400">
                {formatDate(course.dataCadastro)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 items-center">
        {hasValidLink ? (
          <button
            onClick={handleJobClick}
            className="flex-1 bg-secondary text-white font-semibold py-3 px-4 rounded-xl hover:bg-secondary/90 transition-colors text-center text-sm md:text-base flex items-center justify-center gap-2"
          >
            Acessar
          </button>
        ) : (
          <button
            disabled
            className="flex-1 bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl cursor-not-allowed text-center text-sm md:text-base flex items-center justify-center gap-2"
          >
            Link indisponivel
          </button>
        )}
        <button
          onClick={handleWhatsappShare}
          disabled={sharingLoading}
          className="hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center justify-center"
          title="Compartilhar no WhatsApp"
        >
          {sharingLoading ? (
            <Loader2 size={24} className="animate-spin text-primary" />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary hover:scale-110 transition-transform">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M9 10h.01M13 10h.01M17 10h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
