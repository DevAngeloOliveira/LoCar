import { AluguelComRelacoes, CriarAluguelInput } from './aluguel.entity';

export const ALUGUEL_REPOSITORY = Symbol('ALUGUEL_REPOSITORY');

export interface AluguelRepository {
  buscarPorIdCompleto(id: string): Promise<AluguelComRelacoes | null>;
  listar(): Promise<unknown[]>;
  criarComBloqueioDeVeiculo(input: CriarAluguelInput): Promise<unknown>;
  finalizarComLiberacaoDeVeiculo(
    id: string,
    dataFim: Date,
    veiculoId: string,
  ): Promise<unknown>;
}
