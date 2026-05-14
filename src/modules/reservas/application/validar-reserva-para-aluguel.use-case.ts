import { BadRequestException, Injectable } from '@nestjs/common';
import { ReservaCompleta } from '../domain/reserva.repository';
import { BuscarReservaUseCase } from './buscar-reserva.use-case';

@Injectable()
export class ValidarReservaParaAluguelUseCase {
  constructor(private readonly buscarReserva: BuscarReservaUseCase) {}

  async executar(id: string): Promise<ReservaCompleta> {
    const reserva = await this.buscarReserva.executar(id);

    if (reserva.cancelada) {
      throw new BadRequestException(
        'Reserva cancelada não pode gerar aluguel',
      );
    }

    if (reserva.aluguel) {
      throw new BadRequestException('Reserva já possui aluguel associado');
    }

    return reserva;
  }
}
