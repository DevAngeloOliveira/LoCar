export interface Reserva {
  id: string;
  dataReserva: Date;
  dataInicio: Date;
  dataFim: Date;
  cancelada: boolean;
  clienteId: string;
  funcionarioId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CriarReservaInput {
  dataInicio: Date;
  dataFim: Date;
  clienteId: string;
  funcionarioId: string;
  veiculoIds: string[];
}
