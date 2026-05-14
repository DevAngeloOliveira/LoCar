export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoriaComContagem extends Categoria {
  _count: { veiculos: number };
}

export type CategoriaCriacao = Omit<Categoria, 'id' | 'createdAt' | 'updatedAt'>;
