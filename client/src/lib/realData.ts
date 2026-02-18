// Dados reais para teste inicial
export const realJobs = [
  {
    id: 'job-001',
    title: 'Auxiliar de RH',
    company: 'Coco Bambu',
    description: 'Vaga para Auxiliar de RH em Uberlândia',
    link: 'https://cocobambu.gupy.io/job/eyJqb2JJZCI6MTA3ODc3OTUsInNvdXJjZSI6Imd1cHlfcG9ydGFsIn0=?jobBoardSource=share_link',
    city: 'Uberlândia',
    state: 'MG',
    modality: 'Presencial' as const,
    isPCD: false,
    category: 'administrativo' as const,
    status: 'ativa' as const,
  },
  {
    id: 'job-002',
    title: 'Assistente de Produção de Conteúdo Acadêmico',
    company: 'INFNET',
    description: 'Assistente de Produção de Conteúdo Acadêmico',
    link: 'https://vagas-infnet.gupy.io/job/eyJqb2JJZCI6MTA4MTQ1OTUsInNvdXJjZSI6Imd1cHlfcG9ydGFsIn0=?jobBoardSource=share_link',
    city: 'Rio de Janeiro',
    state: 'RJ',
    modality: 'Remoto' as const,
    isPCD: false,
    category: 'operacional' as const,
    status: 'ativa' as const,
  },
];

export const realCourses = [
  {
    id: 'course-001',
    title: 'Microsoft Office 365 - Conhecendo o Outlook',
    institution: 'EV.ORG.BR',
    description: 'Aprenda a utilizar o Microsoft Outlook como ferramenta de comunicação e organização',
    link: 'https://www.ev.org.br/cursos/microsoft-office-365-conhecendo-o-outlook',
    duration: '40h',
    modality: 'Online' as const,
    isFree: true,
    status: 'ativo' as const,
  },
  {
    id: 'course-002',
    title: 'Matemática Financeira com o Uso da HP 12C',
    institution: 'EV.ORG.BR',
    description: 'Curso de Matemática Financeira utilizando a calculadora HP 12C',
    link: 'https://www.ev.org.br/cursos/matematica-financeira-com-o-uso-da-hp-12c',
    duration: '30h',
    modality: 'Online' as const,
    isFree: true,
    status: 'ativo' as const,
  },
];
