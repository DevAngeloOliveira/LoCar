import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Veiculo } from '../domain/veiculo.entity';
import { VEICULO_REPOSITORY, VeiculoRepository } from '../domain/veiculo.repository';
import { BuscarVeiculoUseCase } from './buscar-veiculo.use-case';

@Injectable()
export class RemoverVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository,
    private readonly buscarVeiculo: BuscarVeiculoUseCase,
  ) {}

  async executar(id: string): Promise<Veiculo> {
    await this.buscarVeiculo.garantirExistencia(id);

    const alugueisAtivos = await this.veiculoRepository.contarAlugueisAtivos(id);
    if (alugueisAtivos > 0) {
      throw new BadRequestException('Não é possível remover veículo com aluguéis ativos');
    }

    return this.veiculoRepository.remover(id);
  }
}
