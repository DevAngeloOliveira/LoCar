import { Categoria, CategoriaComContagem, CategoriaCriacao } from './categoria.entity';

export const CATEGORIA_REPOSITORY = Symbol('CATEGORIA_REPOSITORY');

export interface CategoriaRepository {
  buscarPorId(id: string): Promise<Categoria | null>;
  buscarPorIdComVeiculos(id: string): Promise<unknown | null>;
  buscarPorNome(nome: string): Promise<Categoria | null>;
  listarComContagem(): Promise<CategoriaComContagem[]>;
  criar(dados: CategoriaCriacao): Promise<Categoria>;
}
