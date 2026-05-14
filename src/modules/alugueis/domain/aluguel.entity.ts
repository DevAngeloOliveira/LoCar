export interface Aluguel {
  id: string;
  dataInicio: Date;
  dataFim: Date | null;
  valorTotal: number;
  finalizado: boolean;
  reservaId: string;
  clienteId: string;
  veiculoId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AluguelComRelacoes extends Aluguel {
  cliente: unknown;
  veiculo: unknown;
  reserva: unknown;
  pagamento: { id: string } | null;
}

export interface CriarAluguelInput {
  reservaId: string;
  clienteId: string;
  veiculoId: string;
  dataInicio: Date;
  valorTotal: number;
}
