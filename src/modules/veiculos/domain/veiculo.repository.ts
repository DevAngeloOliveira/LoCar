import { TipoVeiculo, Veiculo, VeiculoAtualizacao, VeiculoCriacao } from './veiculo.entity';

export const VEICULO_REPOSITORY = Symbol('VEICULO_REPOSITORY');

export interface FiltroListarVeiculos {
  tipo?: TipoVeiculo;
  disponivel?: boolean;
}

export interface VeiculoRepository {
  buscarPorId(id: string): Promise<Veiculo | null>;
  buscarPorIdCompleto(id: string): Promise<unknown | null>;
  buscarPorPlaca(placa: string): Promise<Veiculo | null>;
  listar(filtro: FiltroListarVeiculos): Promise<unknown[]>;
  criar(dados: VeiculoCriacao): Promise<unknown>;
  atualizar(id: string, dados: VeiculoAtualizacao): Promise<unknown>;
  alterarDisponibilidade(id: string, disponivel: boolean): Promise<Veiculo>;
  remover(id: string): Promise<Veiculo>;
  contarAlugueisAtivos(veiculoId: string): Promise<number>;
  existeConflitoDeReserva(
    veiculoId: string,
    dataInicio: Date,
    dataFim: Date,
  ): Promise<boolean>;
}
