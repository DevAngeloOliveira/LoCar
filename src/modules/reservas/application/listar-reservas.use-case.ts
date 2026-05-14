import { Inject, Injectable } from '@nestjs/common';
import { RESERVA_REPOSITORY, ReservaRepository } from '../domain/reserva.repository';

@Injectable()
export class ListarReservasUseCase {
  constructor(
    @Inject(RESERVA_REPOSITORY)
    private readonly reservaRepository: ReservaRepository,
  ) {}

  executar() {
    return this.reservaRepository.listar();
  }
}
