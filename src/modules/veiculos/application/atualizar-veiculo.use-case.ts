import { Inject, Injectable } from '@nestjs/common';
import { BuscarCategoriaUseCase } from '../../categorias/application/buscar-categoria.use-case';
import {
  VEICULO_REPOSITORY,
  VeiculoRepository,
} from '../domain/veiculo.repository';
import { UpdateVeiculoDto } from '../presentation/dto/update-veiculo.dto';
import { BuscarVeiculoUseCase } from './buscar-veiculo.use-case';

@Injectable()
export class AtualizarVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository,
    private readonly buscarVeiculo: BuscarVeiculoUseCase,
    private readonly buscarCategoria: BuscarCategoriaUseCase,
  ) {}

  async executar(id: string, dados: UpdateVeiculoDto) {
    await this.buscarVeiculo.garantirExistencia(id);

    if (dados.categoriaId) {
      await this.buscarCategoria.garantirExistencia(dados.categoriaId);
    }

    return this.veiculoRepository.atualizar(id, dados);
  }
}
