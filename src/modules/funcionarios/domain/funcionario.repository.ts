import { Funcionario, FuncionarioAtualizacao, FuncionarioCriacao } from './funcionario.entity';

export const FUNCIONARIO_REPOSITORY = Symbol('FUNCIONARIO_REPOSITORY');

export interface FuncionarioRepository {
  buscarPorId(id: string): Promise<Funcionario | null>;
  buscarPorIdComReservas(id: string): Promise<unknown | null>;
  buscarPorMatricula(matricula: string): Promise<Funcionario | null>;
  listarAtivos(): Promise<Funcionario[]>;
  criar(dados: FuncionarioCriacao): Promise<Funcionario>;
  atualizar(id: string, dados: FuncionarioAtualizacao): Promise<Funcionario>;
  desativar(id: string): Promise<Funcionario>;
}
