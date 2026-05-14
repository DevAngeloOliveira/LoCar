import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AtualizarFuncionarioUseCase } from '../application/atualizar-funcionario.use-case';
import { BuscarFuncionarioUseCase } from '../application/buscar-funcionario.use-case';
import { CadastrarFuncionarioUseCase } from '../application/cadastrar-funcionario.use-case';
import { DesativarFuncionarioUseCase } from '../application/desativar-funcionario.use-case';
import { ListarFuncionariosUseCase } from '../application/listar-funcionarios.use-case';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Controller('funcionarios')
export class FuncionariosController {
  constructor(
    private readonly cadastrarFuncionario: CadastrarFuncionarioUseCase,
    private readonly listarFuncionarios: ListarFuncionariosUseCase,
    private readonly buscarFuncionario: BuscarFuncionarioUseCase,
    private readonly atualizarFuncionario: AtualizarFuncionarioUseCase,
    private readonly desativarFuncionario: DesativarFuncionarioUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateFuncionarioDto) {
    return this.cadastrarFuncionario.executar(dto);
  }

  @Get()
  findAll() {
    return this.listarFuncionarios.executar();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buscarFuncionario.executar(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFuncionarioDto) {
    return this.atualizarFuncionario.executar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.desativarFuncionario.executar(id);
  }
}
