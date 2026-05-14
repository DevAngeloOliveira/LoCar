import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AluguelComRelacoes } from '../domain/aluguel.entity';
import {
  ALUGUEL_REPOSITORY,
  AluguelRepository,
} from '../domain/aluguel.repository';

@Injectable()
export class BuscarAluguelUseCase {
  constructor(
    @Inject(ALUGUEL_REPOSITORY)
    private readonly aluguelRepository: AluguelRepository,
  ) {}

  async executar(id: string): Promise<AluguelComRelacoes> {
    const aluguel = await this.aluguelRepository.buscarPorIdCompleto(id);
    if (!aluguel) {
      throw new NotFoundException('Aluguel não encontrado');
    }
    return aluguel;
  }
}
