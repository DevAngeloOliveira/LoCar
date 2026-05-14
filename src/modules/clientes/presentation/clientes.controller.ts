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
import { AtualizarClienteUseCase } from '../application/atualizar-cliente.use-case';
import { BuscarClienteUseCase } from '../application/buscar-cliente.use-case';
import { CadastrarClienteUseCase } from '../application/cadastrar-cliente.use-case';
import { DesativarClienteUseCase } from '../application/desativar-cliente.use-case';
import { ListarClientesUseCase } from '../application/listar-clientes.use-case';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(
    private readonly cadastrarCliente: CadastrarClienteUseCase,
    private readonly listarClientes: ListarClientesUseCase,
    private readonly buscarCliente: BuscarClienteUseCase,
    private readonly atualizarCliente: AtualizarClienteUseCase,
    private readonly desativarCliente: DesativarClienteUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateClienteDto) {
    return this.cadastrarCliente.executar(dto);
  }

  @Get()
  findAll() {
    return this.listarClientes.executar();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buscarCliente.executar(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.atualizarCliente.executar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.desativarCliente.executar(id);
  }
}
