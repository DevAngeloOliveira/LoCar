import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Categoria } from '../domain/categoria.entity';
import { CATEGORIA_REPOSITORY, CategoriaRepository } from '../domain/categoria.repository';

@Injectable()
export class BuscarCategoriaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  async executar(id: string): Promise<unknown> {
    const categoria = await this.categoriaRepository.buscarPorIdComVeiculos(id);
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return categoria;
  }

  async garantirExistencia(id: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository.buscarPorId(id);
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return categoria;
  }
}
