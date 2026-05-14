import { Inject, Injectable } from '@nestjs/common';
import { Veiculo } from '../domain/veiculo.entity';
import { VEICULO_REPOSITORY, VeiculoRepository } from '../domain/veiculo.repository';
import { BuscarVeiculoUseCase } from './buscar-veiculo.use-case';

@Injectable()
export class AlterarDisponibilidadeUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository,
    private readonly buscarVeiculo: BuscarVeiculoUseCase,
  ) {}

  async executar(id: string, disponivel: boolean): Promise<Veiculo> {
    await this.buscarVeiculo.garantirExistencia(id);
    return this.veiculoRepository.alterarDisponibilidade(id, disponivel);
  }
}
