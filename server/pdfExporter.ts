import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface JobReport {
  id: string;
  title: string;
  company: string;
  city: string;
  state: string;
  modality: string;
  isPCD: boolean;
  clicks: number;
  whatsappShares: number;
  createdAt: Date;
}

interface CourseReport {
  id: string;
  title: string;
  institution: string;
  hours: number;
  modality: string;
  isFree: boolean;
  clicks: number;
  whatsappShares: number;
  createdAt: Date;
}

interface LinkReport {
  id: string;
  originalUrl: string;
  shortCode: string;
  alias: string;
  clicks: number;
  createdAt: Date;
}

export function generateJobsReportPDF(jobs: JobReport[]): Buffer {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Relatório de Vagas', 14, 15);
  
  // Data
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 25);
  
  // Resumo
  const totalClicks = jobs.reduce((sum, job) => sum + (job.clicks || 0), 0);
  const totalShares = jobs.reduce((sum, job) => sum + (job.whatsappShares || 0), 0);
  
  doc.setFontSize(12);
  doc.text('Resumo Executivo', 14, 35);
  doc.setFontSize(10);
  doc.text(`Total de Vagas: ${jobs.length}`, 14, 42);
  doc.text(`Total de Cliques: ${totalClicks}`, 14, 49);
  doc.text(`Total de Compartilhamentos: ${totalShares}`, 14, 56);
  
  // Tabela
  const tableData = jobs.map(job => [
    job.title,
    job.company,
    `${job.city}, ${job.state}`,
    job.modality,
    job.isPCD ? 'Sim' : 'Não',
    job.clicks || 0,
    job.whatsappShares || 0
  ]);
  
  (doc as any).autoTable({
    head: [['Vaga', 'Empresa', 'Localização', 'Modalidade', 'PCD', 'Cliques', 'Compartilhamentos']],
    body: tableData,
    startY: 65,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [107, 31, 176],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });
  
  return Buffer.from(doc.output('arraybuffer'));
}

export function generateCoursesReportPDF(courses: CourseReport[]): Buffer {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Relatório de Cursos', 14, 15);
  
  // Data
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 25);
  
  // Resumo
  const totalClicks = courses.reduce((sum, course) => sum + (course.clicks || 0), 0);
  const totalShares = courses.reduce((sum, course) => sum + (course.whatsappShares || 0), 0);
  const freeCount = courses.filter(c => c.isFree).length;
  
  doc.setFontSize(12);
  doc.text('Resumo Executivo', 14, 35);
  doc.setFontSize(10);
  doc.text(`Total de Cursos: ${courses.length}`, 14, 42);
  doc.text(`Cursos Gratuitos: ${freeCount}`, 14, 49);
  doc.text(`Total de Cliques: ${totalClicks}`, 14, 56);
  doc.text(`Total de Compartilhamentos: ${totalShares}`, 14, 63);
  
  // Tabela
  const tableData = courses.map(course => [
    course.title,
    course.institution,
    `${course.hours}h`,
    course.modality,
    course.isFree ? 'Sim' : 'Não',
    course.clicks || 0,
    course.whatsappShares || 0
  ]);
  
  (doc as any).autoTable({
    head: [['Curso', 'Instituição', 'Carga Horária', 'Modalidade', 'Gratuito', 'Cliques', 'Compartilhamentos']],
    body: tableData,
    startY: 70,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [107, 31, 176],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });
  
  return Buffer.from(doc.output('arraybuffer'));
}

export function generateLinksReportPDF(links: LinkReport[]): Buffer {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Relatório de Links Encurtados', 14, 15);
  
  // Data
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 25);
  
  // Resumo
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  
  doc.setFontSize(12);
  doc.text('Resumo Executivo', 14, 35);
  doc.setFontSize(10);
  doc.text(`Total de Links: ${links.length}`, 14, 42);
  doc.text(`Total de Acessos: ${totalClicks}`, 14, 49);
  
  // Tabela
  const tableData = links.map(link => [
    link.alias || link.shortCode,
    link.shortCode,
    link.clicks || 0,
    new Date(link.createdAt).toLocaleDateString('pt-BR')
  ]);
  
  (doc as any).autoTable({
    head: [['Apelido', 'Código Curto', 'Acessos', 'Data de Criação']],
    body: tableData,
    startY: 60,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [107, 31, 176],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });
  
  return Buffer.from(doc.output('arraybuffer'));
}
