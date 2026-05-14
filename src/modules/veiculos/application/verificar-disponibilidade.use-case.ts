import { Inject, Injectable } from '@nestjs/common';
import {
  VEICULO_REPOSITORY,
  VeiculoRepository,
} from '../domain/veiculo.repository';
import { BuscarVeiculoUseCase } from './buscar-veiculo.use-case';

@Injectable()
export class VerificarDisponibilidadeUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository,
    private readonly buscarVeiculo: BuscarVeiculoUseCase,
  ) {}

  async executar(
    veiculoId: string,
    dataInicio: Date,
    dataFim: Date,
  ): Promise<boolean> {
    const veiculo = await this.buscarVeiculo.garantirExistencia(veiculoId);
    if (!veiculo.disponivel) {
      return false;
    }
    const temConflito = await this.veiculoRepository.existeConflitoDeReserva(
      veiculoId,
      dataInicio,
      dataFim,
    );
    return !temConflito;
  }
}
