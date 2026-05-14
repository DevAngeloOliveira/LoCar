import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ALUGUEL_REPOSITORY, AluguelRepository } from '../domain/aluguel.repository';
import { FinalizarAluguelDto } from '../presentation/dto/finalizar-aluguel.dto';
import { BuscarAluguelUseCase } from './buscar-aluguel.use-case';

@Injectable()
export class FinalizarAluguelUseCase {
  constructor(
    @Inject(ALUGUEL_REPOSITORY)
    private readonly aluguelRepository: AluguelRepository,
    private readonly buscarAluguel: BuscarAluguelUseCase,
  ) {}

  async executar(id: string, dto: FinalizarAluguelDto) {
    const aluguel = await this.buscarAluguel.executar(id);

    if (aluguel.finalizado) {
      throw new BadRequestException('Aluguel já está finalizado');
    }

    if (!aluguel.pagamento) {
      throw new BadRequestException('Aluguel não pode ser finalizado sem pagamento');
    }

    const dataFim = new Date(dto.dataFim);
    if (dataFim < aluguel.dataInicio) {
      throw new BadRequestException('Data de fim não pode ser anterior à data de início');
    }

    return this.aluguelRepository.finalizarComLiberacaoDeVeiculo(id, dataFim, aluguel.veiculoId);
  }
}
