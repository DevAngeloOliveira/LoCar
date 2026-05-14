import { CriarPagamentoInput, Pagamento } from './pagamento.entity';

export const PAGAMENTO_REPOSITORY = Symbol('PAGAMENTO_REPOSITORY');

export interface PagamentoRepository {
  buscarPorIdCompleto(id: string): Promise<unknown | null>;
  buscarPorAluguel(aluguelId: string): Promise<Pagamento | null>;
  listar(): Promise<unknown[]>;
  criar(input: CriarPagamentoInput): Promise<unknown>;
}
