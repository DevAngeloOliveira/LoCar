import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Categoria } from '../domain/categoria.entity';
import { CATEGORIA_REPOSITORY, CategoriaRepository } from '../domain/categoria.repository';
import { CreateCategoriaDto } from '../presentation/dto/create-categoria.dto';

@Injectable()
export class CadastrarCategoriaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  async executar(dados: CreateCategoriaDto): Promise<Categoria> {
    const existente = await this.categoriaRepository.buscarPorNome(dados.nome);
    if (existente) {
      throw new ConflictException('Categoria já cadastrada');
    }
    return this.categoriaRepository.criar(dados);
  }
}
