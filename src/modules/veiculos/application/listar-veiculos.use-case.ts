import { Inject, Injectable } from '@nestjs/common';
import { TipoVeiculo } from '../domain/veiculo.entity';
import {
  VEICULO_REPOSITORY,
  VeiculoRepository,
} from '../domain/veiculo.repository';

@Injectable()
export class ListarVeiculosUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository,
  ) {}

  executar(filtro: { tipo?: TipoVeiculo; disponivel?: boolean }) {
    return this.veiculoRepository.listar(filtro);
  }
}
