import { CriarReservaInput } from './reserva.entity';

export const RESERVA_REPOSITORY = Symbol('RESERVA_REPOSITORY');

export interface ReservaCompleta {
  id: string;
  dataInicio: Date;
  dataFim: Date;
  cancelada: boolean;
  clienteId: string;
  funcionarioId: string;
  veiculos: { veiculoId: string; veiculo: { id: string; modelo: string } }[];
  aluguel: { id: string } | null;
}

export interface ReservaRepository {
  criarComVeiculos(dados: CriarReservaInput): Promise<unknown>;
  listar(): Promise<unknown[]>;
  buscarPorIdCompleto(id: string): Promise<ReservaCompleta | null>;
  cancelar(id: string): Promise<unknown>;
  existeConflitoDePeriodo(
    veiculoId: string,
    dataInicio: Date,
    dataFim: Date,
  ): Promise<boolean>;
}
