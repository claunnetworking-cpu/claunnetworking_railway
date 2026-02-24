import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Download, ChevronLeft } from 'lucide-react';

export default function AdminReports() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'jobs' | 'courses' | 'links'>('jobs');

  const { data: jobsData } = trpc.jobs.list.useQuery();
  const { data: coursesData } = trpc.courses.list.useQuery();
  const { data: linksData } = trpc.links.list.useQuery();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLocation('/login');
    }
  }, [setLocation]);

  const handleExportPDF = (type: 'jobs' | 'courses' | 'links') => {
    // Implementação simplificada de exportação
    let content = '';
    let filename = '';

    if (type === 'jobs' && jobsData) {
      filename = 'relatorio-vagas.txt';
      content = 'RELATÓRIO DE VAGAS\n';
      content += '==================\n\n';
      jobsData.forEach((job: any) => {
        content += `Título: ${job.title}\n`;
        content += `Empresa: ${job.company}\n`;
        content += `Modalidade: ${job.modality}\n`;
        content += `Cliques: ${job.clicks || 0}\n`;
        content += `Compartilhamentos: ${job.whatsappShares || 0}\n`;
        content += '---\n';
      });
    } else if (type === 'courses' && coursesData) {
      filename = 'relatorio-cursos.txt';
      content = 'RELATÓRIO DE CURSOS\n';
      content += '===================\n\n';
      coursesData.forEach((course: any) => {
        content += `Título: ${course.title}\n`;
        content += `Instituição: ${course.institution}\n`;
        content += `Modalidade: ${course.modality}\n`;
        content += `Cliques: ${course.clicks || 0}\n`;
        content += `Compartilhamentos: ${course.whatsappShares || 0}\n`;
        content += '---\n';
      });
    } else if (type === 'links' && linksData) {
      filename = 'relatorio-links.txt';
      content = 'RELATÓRIO DE LINKS\n';
      content += '==================\n\n';
      linksData.forEach((link: any) => {
        content += `Apelido: ${link.alias || 'N/A'}\n`;
        content += `Código: ${link.shortCode}\n`;
        content += `Cliques: ${link.clicks || 0}\n`;
        content += '---\n';
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setLocation('/admin')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'jobs'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Relatório de Vagas
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'courses'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Relatório de Cursos
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'links'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Relatório de Links
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={() => handleExportPDF(activeTab)}
          className="mb-6 flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exportar Relatório
        </button>

        {/* Jobs Report */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vaga</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Empresa</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Cliques</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Compartilhamentos</th>
                </tr>
              </thead>
              <tbody>
                {jobsData && jobsData.length > 0 ? (
                  jobsData.map((job: any) => (
                    <tr key={job.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{job.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{job.company}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900">{job.clicks || 0}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900">{job.whatsappShares || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma vaga cadastrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Courses Report */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Curso</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Instituição</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Cliques</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Compartilhamentos</th>
                </tr>
              </thead>
              <tbody>
                {coursesData && coursesData.length > 0 ? (
                  coursesData.map((course: any) => (
                    <tr key={course.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{course.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{course.institution}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900">{course.clicks || 0}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900">{course.whatsappShares || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Nenhum curso cadastrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Links Report */}
        {activeTab === 'links' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Apelido</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Código</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Cliques</th>
                </tr>
              </thead>
              <tbody>
                {linksData && linksData.length > 0 ? (
                  linksData.map((link: any) => (
                    <tr key={link.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{link.alias || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{link.shortCode}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900">{link.clicks || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Nenhum link criado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
