import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { BuscarCategoriaUseCase } from '../../categorias/application/buscar-categoria.use-case';
import {
  VEICULO_REPOSITORY,
  VeiculoRepository,
} from '../domain/veiculo.repository';
import { CreateVeiculoDto } from '../presentation/dto/create-veiculo.dto';

@Injectable()
export class CadastrarVeiculoUseCase {
  constructor(
    @Inject(VEICULO_REPOSITORY)
    private readonly veiculoRepository: VeiculoRepository,
    private readonly buscarCategoria: BuscarCategoriaUseCase,
  ) {}

  async executar(dados: CreateVeiculoDto) {
    const placaExistente = await this.veiculoRepository.buscarPorPlaca(
      dados.placa,
    );
    if (placaExistente) {
      throw new ConflictException('Placa já cadastrada no sistema');
    }

    await this.buscarCategoria.garantirExistencia(dados.categoriaId);

    return this.veiculoRepository.criar({
      placa: dados.placa,
      marca: dados.marca,
      modelo: dados.modelo,
      ano: dados.ano,
      cor: dados.cor,
      valorDiaria: dados.valorDiaria,
      tipo: dados.tipo,
      categoriaId: dados.categoriaId,
      numeroPortas: dados.numeroPortas ?? null,
      possuiArCondicionado: dados.possuiArCondicionado ?? null,
      cilindradas: dados.cilindradas ?? null,
      bau: dados.bau ?? null,
      capacidadeCarga: dados.capacidadeCarga ?? null,
    });
  }
}
