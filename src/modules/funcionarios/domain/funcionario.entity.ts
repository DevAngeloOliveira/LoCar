export interface Funcionario {
  id: string;
  nome: string;
  matricula: string;
  cargo: string;
  telefone: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type FuncionarioCriacao = Omit<
  Funcionario,
  'id' | 'createdAt' | 'updatedAt'
>;
export type FuncionarioAtualizacao = Partial<
  Omit<Funcionario, 'id' | 'matricula' | 'createdAt' | 'updatedAt'>
>;
