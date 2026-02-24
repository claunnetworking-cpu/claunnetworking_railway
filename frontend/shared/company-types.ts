// Tipos para sistema de cadastro de empresas

export interface CompanyRegistrationData {
  // Dados da empresa
  companyName: string;
  cnpj: string;
  businessArea: string;
  
  // Responsável pelo contrato
  contractResponsible: string;
  responsibleEmail: string;
  businessPhone: string;
  whatsapp: string;
  
  // Credenciais de acesso
  loginEmail: string;
  password: string;
  confirmPassword: string;
}

export interface ServiceRequestData {
  serviceType: 'job' | 'mentorship' | 'course' | 'resume';
  requestType: 'public_link' | 'full_form';
  title: string;
  description?: string;
  
  // Para vaga com link público
  externalLink?: string;
  
  // Para vaga sem link (formulário completo)
  city?: string;
  state?: string;
  modality?: 'presencial' | 'remoto' | 'hibrido';
  level?: 'junior' | 'pleno' | 'senior' | 'estagio' | 'jovem_aprendiz' | 'gerente' | 'coordenador' | 'especialista';
  salary?: number;
  salaryVisible?: boolean;
  benefits?: string;
  applicationDeadline?: Date;
  applicationType?: 'email' | 'whatsapp' | 'website';
  applicationRedirect?: string;
}

export interface CompanyJobData {
  title: string;
  description: string;
  city: string;
  state: string;
  modality: 'presencial' | 'remoto' | 'hibrido';
  level: 'junior' | 'pleno' | 'senior' | 'estagio' | 'jovem_aprendiz' | 'gerente' | 'coordenador' | 'especialista';
  salary?: number;
  salaryVisible: boolean;
  benefits?: string;
  applicationDeadline?: Date;
  applicationType: 'email' | 'whatsapp' | 'website';
  applicationRedirect: string;
}

export interface CompanyAccount {
  id: string;
  userId: number;
  companyId: string;
  contractResponsible: string;
  responsibleEmail: string;
  businessPhone: string;
  whatsapp: string;
  accountStatus: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRequest {
  id: string;
  companyId: string;
  serviceType: 'job' | 'mentorship' | 'course' | 'resume';
  requestType: 'public_link' | 'full_form';
  status: 'pending' | 'analyzing' | 'approved' | 'rejected';
  rejectionReason?: string;
  title: string;
  description?: string;
  externalLink?: string;
  city?: string;
  state?: string;
  modality?: 'presencial' | 'remoto' | 'hibrido';
  level?: 'junior' | 'pleno' | 'senior' | 'estagio' | 'jovem_aprendiz' | 'gerente' | 'coordenador' | 'especialista';
  salary?: number;
  salaryVisible: boolean;
  benefits?: string;
  applicationDeadline?: Date;
  applicationType: 'email' | 'whatsapp' | 'website';
  applicationRedirect?: string;
  totalClicks: number;
  totalViews: number;
  totalApplications: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
}

export interface CompanyJob {
  id: string;
  requestId: string;
  companyId: string;
  title: string;
  description: string;
  city: string;
  state: string;
  modality: 'presencial' | 'remoto' | 'hibrido';
  level: 'junior' | 'pleno' | 'senior' | 'estagio' | 'jovem_aprendiz' | 'gerente' | 'coordenador' | 'especialista';
  salary?: number;
  salaryVisible: boolean;
  benefits?: string;
  applicationDeadline?: Date;
  applicationType: 'email' | 'whatsapp' | 'website';
  applicationRedirect: string;
  totalClicks: number;
  totalViews: number;
  totalApplications: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  expiresAt?: Date;
}
