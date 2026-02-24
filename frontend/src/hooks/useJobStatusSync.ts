import { useEffect, useState, useCallback } from "react";

export interface JobRequest {
  id: string;
  title: string;
  status: "pending" | "approved" | "rejected" | "analysis";
  createdAt: string;
  type: "vaga_com_link" | "vaga_sem_link";
  rejectionReason?: string;
  clicks?: number;
  views?: number;
}

/**
 * Hook para sincronizar status de vagas em tempo real
 * Atualiza automaticamente quando há mudanças no admin
 */
export function useJobStatusSync(companyId?: string) {
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implementar query real quando router company estiver disponível
  // const jobsQuery = trpc.company.getCompanyJobs.useQuery(
  //   { companyId: companyId || "" },
  //   { enabled: !!companyId }
  // );

  // Função para recarregar dados
  const refetch = useCallback(() => {
    setIsLoading(true);
    // TODO: Chamar jobsQuery.refetch()
  }, []);

  // Função para invalidar cache (chamada quando admin aprova/rejeita)
  const invalidateJobs = useCallback(() => {
    // TODO: Chamar utils.company.getCompanyJobs.invalidate()
  }, []);

  // Setup de polling para sincronização automática a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (companyId) {
        refetch();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [companyId, refetch]);

  return {
    jobs,
    isLoading,
    error,
    refetch,
    invalidateJobs,
  };
}

/**
 * Hook para monitorar mudanças de status de uma vaga específica
 */
export function useJobStatusMonitor(jobId: string) {
  const [status, setStatus] = useState<JobRequest["status"] | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  // TODO: Implementar query real quando router company estiver disponível
  // const jobQuery = trpc.company.getJobById.useQuery(
  //   { jobId },
  //   { enabled: !!jobId }
  // );

  const refetch = useCallback(() => {
    // TODO: Chamar jobQuery.refetch()
  }, []);

  return {
    status,
    rejectionReason,
    refetch,
    isLoading: false,
    error: null,
  };
}

/**
 * Hook para sincronizar estatísticas de vaga
 */
export function useJobStats(jobId: string) {
  const [stats, setStats] = useState({ clicks: 0, views: 0, shares: 0 });

  // TODO: Implementar query real quando router company estiver disponível
  // const statsQuery = trpc.company.getJobStats.useQuery(
  //   { jobId },
  //   { enabled: !!jobId }
  // );

  // Polling a cada 10 segundos para estatísticas
  useEffect(() => {
    const interval = setInterval(() => {
      if (jobId) {
        // TODO: Chamar statsQuery.refetch()
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [jobId]);

  return {
    stats,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}
