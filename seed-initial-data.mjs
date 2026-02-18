import { createConnection } from 'mysql2/promise';
import { nanoid } from 'nanoid';

const connection = await createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/')[3]?.split('?')[0] || 'test',
});

const jobs = [
  {
    id: nanoid(),
    title: 'Auxiliar de RH',
    company: 'Coco Bambu',
    description: 'Vaga para Auxiliar de RH em Uberlândia',
    link: 'https://cocobambu.gupy.io/job/eyJqb2JJZCI6MTA3ODc3OTUsInNvdXJjZSI6Imd1cHlfcG9ydGFsIn0=?jobBoardSource=share_link',
    city: 'Uberlândia',
    state: 'MG',
    modality: 'Presencial',
    isPCD: false,
    category: 'administrativo',
    status: 'ativa',
  },
  {
    id: nanoid(),
    title: 'Assistente de Produção de Conteúdo Acadêmico',
    company: 'INFNET',
    description: 'Assistente de Produção de Conteúdo Acadêmico',
    link: 'https://vagas-infnet.gupy.io/job/eyJqb2JJZCI6MTA4MTQ1OTUsInNvdXJjZSI6Imd1cHlfcG9ydGFsIn0=?jobBoardSource=share_link',
    city: 'Rio de Janeiro',
    state: 'RJ',
    modality: 'Remoto',
    isPCD: false,
    category: 'operacional',
    status: 'ativa',
  },
];

const courses = [
  {
    id: nanoid(),
    title: 'Microsoft Office 365 - Conhecendo o Outlook',
    institution: 'EV.ORG.BR',
    description: 'Aprenda a utilizar o Microsoft Outlook como ferramenta de comunicação e organização',
    link: 'https://www.ev.org.br/cursos/microsoft-office-365-conhecendo-o-outlook',
    duration: '40h',
    modality: 'Online',
    isFree: true,
    status: 'ativo',
  },
  {
    id: nanoid(),
    title: 'Matemática Financeira com o Uso da HP 12C',
    institution: 'EV.ORG.BR',
    description: 'Curso de Matemática Financeira utilizando a calculadora HP 12C',
    link: 'https://www.ev.org.br/cursos/matematica-financeira-com-o-uso-da-hp-12c',
    duration: '30h',
    modality: 'Online',
    isFree: true,
    status: 'ativo',
  },
];

try {
  for (const job of jobs) {
    await connection.execute(
      'INSERT INTO jobs (id, title, company, description, link, city, state, modality, isPCD, category, status, clicks, whatsappShares, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NOW(), NOW())',
      [job.id, job.title, job.company, job.description, job.link, job.city, job.state, job.modality, job.isPCD, job.category, job.status]
    );
  }

  for (const course of courses) {
    await connection.execute(
      'INSERT INTO courses (id, title, institution, description, link, duration, modality, isFree, status, clicks, whatsappShares, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NOW(), NOW())',
      [course.id, course.title, course.institution, course.description, course.link, course.duration, course.modality, course.isFree, course.status]
    );
  }

  console.log('✅ Dados iniciais inseridos com sucesso!');
} catch (error) {
  console.error('❌ Erro ao inserir dados:', error);
} finally {
  await connection.end();
}
