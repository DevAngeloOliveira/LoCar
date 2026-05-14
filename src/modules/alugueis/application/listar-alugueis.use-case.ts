import { Inject, Injectable } from '@nestjs/common';
import {
  ALUGUEL_REPOSITORY,
  AluguelRepository,
} from '../domain/aluguel.repository';

@Injectable()
export class ListarAlugueisUseCase {
  constructor(
    @Inject(ALUGUEL_REPOSITORY)
    private readonly aluguelRepository: AluguelRepository,
  ) {}

  executar() {
    return this.aluguelRepository.listar();
  }
}
