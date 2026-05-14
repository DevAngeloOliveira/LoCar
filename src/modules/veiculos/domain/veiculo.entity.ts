import { TipoVeiculo } from '@prisma/client';

export { TipoVeiculo };

export interface Veiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  valorDiaria: number;
  disponivel: boolean;
  tipo: TipoVeiculo;
  numeroPortas: number | null;
  possuiArCondicionado: boolean | null;
  cilindradas: number | null;
  bau: boolean | null;
  capacidadeCarga: number | null;
  categoriaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type VeiculoCriacao = Omit<Veiculo, 'id' | 'disponivel' | 'createdAt' | 'updatedAt'> & {
  disponivel?: boolean;
};
export type VeiculoAtualizacao = Partial<
  Omit<Veiculo, 'id' | 'placa' | 'tipo' | 'createdAt' | 'updatedAt'>
>;
