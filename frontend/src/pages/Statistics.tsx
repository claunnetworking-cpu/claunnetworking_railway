import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ChevronLeft, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function Statistics() {
  const [, setLocation] = useLocation();
  const [jobsByCategory, setJobsByCategory] = useState<any[]>([]);
  const [jobsByModality, setJobsByModality] = useState<any[]>([]);
  const [jobsByPeriod, setJobsByPeriod] = useState<any[]>([]);
  const [coursesByCategory, setCoursesByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: jobsData } = trpc.jobs.list.useQuery();
  const { data: coursesData } = trpc.courses.list.useQuery();

  useEffect(() => {
    if (jobsData && coursesData) {
      // Processar vagas por categoria
      const jobsCategory: Record<string, number> = {};
      jobsData.forEach((job: any) => {
        const category = job.category || 'Sem categoria';
        jobsCategory[category] = (jobsCategory[category] || 0) + 1;
      });
      setJobsByCategory(
        Object.entries(jobsCategory)
          .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))
          .sort((a, b) => b.value - a.value)
      );

      // Processar vagas por modalidade
      const jobsModality: Record<string, number> = {};
      jobsData.forEach((job: any) => {
        const modality = job.modality || 'Sem modalidade';
        jobsModality[modality] = (jobsModality[modality] || 0) + 1;
      });
      setJobsByModality(
        Object.entries(jobsModality).map(([name, value]) => ({
          name,
          value,
        }))
      );

      // Processar vagas por período (últimos 7 dias)
      const jobsPeriod: Record<string, number> = {};
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
        jobsPeriod[dateStr] = 0;
      }
      jobsData.forEach((job: any) => {
        if (job.createdAt) {
          const jobDate = new Date(job.createdAt);
          const dateStr = jobDate.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
          if (jobsPeriod[dateStr] !== undefined) {
            jobsPeriod[dateStr]++;
          }
        }
      });
      setJobsByPeriod(
        Object.entries(jobsPeriod).map(([date, count]) => ({
          date,
          vagas: count,
        }))
      );

      // Processar cursos por categoria
      const coursesCategory: Record<string, number> = {};
      coursesData.forEach((course: any) => {
        const category = course.category || 'Sem categoria';
        coursesCategory[category] = (coursesCategory[category] || 0) + 1;
      });
      setCoursesByCategory(
        Object.entries(coursesCategory)
          .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))
          .sort((a, b) => b.value - a.value)
      );

      setLoading(false);
    }
  }, [jobsData, coursesData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setLocation('/admin')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Estatísticas</h1>
            <p className="text-gray-600 text-sm mt-1">Análise de tendências de vagas e cursos</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Vagas</p>
                <p className="text-3xl font-bold text-primary mt-2">{jobsData?.length || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Cursos</p>
                <p className="text-3xl font-bold text-secondary mt-2">{coursesData?.length || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Categorias (Vagas)</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{jobsByCategory.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Modalidades</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{jobsByModality.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Vagas por Categoria */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vagas por Categoria</h2>
            {jobsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7c3aed" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">Sem dados disponíveis</p>
            )}
          </div>

          {/* Vagas por Modalidade */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vagas por Modalidade</h2>
            {jobsByModality.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobsByModality}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobsByModality.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">Sem dados disponíveis</p>
            )}
          </div>

          {/* Vagas por Período */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Vagas (Últimos 7 dias)</h2>
            {jobsByPeriod.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={jobsByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="vagas"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">Sem dados disponíveis</p>
            )}
          </div>

          {/* Cursos por Categoria */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cursos por Categoria</h2>
            {coursesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coursesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">Sem dados disponíveis</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
