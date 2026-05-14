import { Cliente, ClienteAtualizacao, ClienteCriacao } from './cliente.entity';

export const CLIENTE_REPOSITORY = Symbol('CLIENTE_REPOSITORY');

export interface ClienteRepository {
  buscarPorId(id: string): Promise<Cliente | null>;
  buscarPorCpf(cpf: string): Promise<Cliente | null>;
  listarAtivos(): Promise<Cliente[]>;
  criar(dados: ClienteCriacao): Promise<Cliente>;
  atualizar(id: string, dados: ClienteAtualizacao): Promise<Cliente>;
  desativar(id: string): Promise<Cliente>;
}
