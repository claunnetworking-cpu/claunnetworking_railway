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
  const isJob = type === 'job';
  const job = item as Vaga;
  const course = item as Curso;

  const handleWhatsappShare = async () => {
    setSharingLoading(true);
    try {
      const share = await createShareMutation.mutateAsync({
        resourceType: type,
        resourceId: item.id,
      });

      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/shared/${share.shareToken}`;
      const text = isJob
        ? `Vaga: ${job.titulo}\n${shareUrl}`
        : `Curso: ${course.titulo}\n${shareUrl}`;
      
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      toast.success('Link gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast.error('Erro ao gerar link de compartilhamento');
    } finally {
      setSharingLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg md:text-xl font-bold text-primary flex-1">
            {isJob ? job.titulo : course.titulo}
          </h3>
          {!isJob && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              Grátis
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm md:text-base">
          {isJob ? job.empresa : course.instituicao}
        </p>
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
            </div>
            {job.pcd && (
              <div className="flex items-center gap-2 text-secondary font-semibold">
                <Users size={16} />
                <span>PCD</span>
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
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xs">{course.dataCadastro}</span>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <a
          href={isJob ? job.link : course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-secondary text-white font-semibold py-3 px-4 rounded-xl hover:bg-secondary/90 transition-colors text-center text-sm md:text-base"
        >
          Acessar
        </a>
        <button
          onClick={handleWhatsappShare}
          disabled={sharingLoading}
          className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 disabled:bg-gray-400 transition-colors flex items-center justify-center"
          title="Compartilhar no WhatsApp"
        >
          {sharingLoading ? <Loader2 size={20} className="animate-spin" /> : <Share2 size={20} />}
        </button>
      </div>
    </div>
  );
}
