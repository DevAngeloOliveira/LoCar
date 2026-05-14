import { TipoPagamento } from '@prisma/client';

export { TipoPagamento };

export interface Pagamento {
  id: string;
  tipo: TipoPagamento;
  valor: number;
  dataPagamento: Date;
  aluguelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CriarPagamentoInput {
  tipo: TipoPagamento;
  valor: number;
  aluguelId: string;
}
