import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  RESERVA_REPOSITORY,
  ReservaRepository,
} from '../domain/reserva.repository';
import { BuscarReservaUseCase } from './buscar-reserva.use-case';

@Injectable()
export class CancelarReservaUseCase {
  constructor(
    @Inject(RESERVA_REPOSITORY)
    private readonly reservaRepository: ReservaRepository,
    private readonly buscarReserva: BuscarReservaUseCase,
  ) {}

  async executar(id: string) {
    const reserva = await this.buscarReserva.executar(id);

    if (reserva.cancelada) {
      throw new BadRequestException('Reserva já está cancelada');
    }

    if (reserva.aluguel) {
      throw new BadRequestException(
        'Não é possível cancelar reserva com aluguel associado',
      );
    }

    return this.reservaRepository.cancelar(id);
  }
}
