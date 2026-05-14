import { Inject, Injectable } from '@nestjs/common';
import { CategoriaComContagem } from '../domain/categoria.entity';
import {
  CATEGORIA_REPOSITORY,
  CategoriaRepository,
} from '../domain/categoria.repository';

@Injectable()
export class ListarCategoriasUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  executar(): Promise<CategoriaComContagem[]> {
    return this.categoriaRepository.listarComContagem();
  }
}
