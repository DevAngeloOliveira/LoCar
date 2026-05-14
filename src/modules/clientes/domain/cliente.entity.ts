export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
  email: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ClienteCriacao = Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>;
export type ClienteAtualizacao = Partial<Omit<Cliente, 'id' | 'cpf' | 'createdAt' | 'updatedAt'>>;
