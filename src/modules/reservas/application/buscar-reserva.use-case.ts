import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  RESERVA_REPOSITORY,
  ReservaCompleta,
  ReservaRepository,
} from '../domain/reserva.repository';

@Injectable()
export class BuscarReservaUseCase {
  constructor(
    @Inject(RESERVA_REPOSITORY)
    private readonly reservaRepository: ReservaRepository,
  ) {}

  async executar(id: string): Promise<ReservaCompleta> {
    const reserva = await this.reservaRepository.buscarPorIdCompleto(id);
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }
    return reserva;
  }
}
