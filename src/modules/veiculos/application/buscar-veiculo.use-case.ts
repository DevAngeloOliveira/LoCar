import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Veiculo } from '../domain/veiculo.entity';
import {
  VEICULO_REPOSITORY,
  VeiculoRepository,
} from '../domain/veiculo.repository';

@Injectable()
export class BuscarVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository,
  ) {}

  async executar(id: string): Promise<unknown> {
    const veiculo = await this.veiculoRepository.buscarPorIdCompleto(id);
    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }
    return veiculo;
  }

  async garantirExistencia(id: string): Promise<Veiculo> {
    const veiculo = await this.veiculoRepository.buscarPorId(id);
    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }
    return veiculo;
  }
}
