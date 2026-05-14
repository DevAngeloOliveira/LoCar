import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BuscarCategoriaUseCase } from '../application/buscar-categoria.use-case';
import { CadastrarCategoriaUseCase } from '../application/cadastrar-categoria.use-case';
import { ListarCategoriasUseCase } from '../application/listar-categorias.use-case';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(
    private readonly cadastrarCategoria: CadastrarCategoriaUseCase,
    private readonly listarCategorias: ListarCategoriasUseCase,
    private readonly buscarCategoria: BuscarCategoriaUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoriaDto) {
    return this.cadastrarCategoria.executar(dto);
  }

  @Get()
  findAll() {
    return this.listarCategorias.executar();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buscarCategoria.executar(id);
  }
}
