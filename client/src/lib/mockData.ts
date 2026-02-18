export interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  estado: string;
  modalidade: 'presencial' | 'remoto' | 'híbrido';
  pcd: boolean;
  descricao: string;
  link: string;
}

export interface Curso {
  id: string;
  titulo: string;
  instituicao: string;
  horas: number;
  modalidade: 'online' | 'presencial' | 'híbrido';
  descricao: string;
  link: string;
  dataCadastro: string;
}

export interface Cargo {
  id: string;
  nome: string;
  posicoes: number;
}

// Dados de teste vazios - serão preenchidos com dados reais do banco
export const vagas: Vaga[] = [];

export const cursos: Curso[] = [];

export const cargosDestaque: Cargo[] = [];

export const vagasPorEstado = [];

export const estatisticas = {
  totalVagas: 0,
  totalCursos: 0,
  vagasRemoto: 0,
  vagasPCD: 0,
  estadosCobertos: 0
};
