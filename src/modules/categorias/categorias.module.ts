import { Module } from '@nestjs/common';
import { BuscarCategoriaUseCase } from './application/buscar-categoria.use-case';
import { CadastrarCategoriaUseCase } from './application/cadastrar-categoria.use-case';
import { ListarCategoriasUseCase } from './application/listar-categorias.use-case';
import { CATEGORIA_REPOSITORY } from './domain/categoria.repository';
import { PrismaCategoriaRepository } from './infra/prisma-categoria.repository';
import { CategoriasController } from './presentation/categorias.controller';

@Module({
  controllers: [CategoriasController],
  providers: [
    CadastrarCategoriaUseCase,
    ListarCategoriasUseCase,
    BuscarCategoriaUseCase,
    {
      provide: CATEGORIA_REPOSITORY,
      useClass: PrismaCategoriaRepository,
    },
  ],
  exports: [BuscarCategoriaUseCase],
})
export class CategoriasModule {}
