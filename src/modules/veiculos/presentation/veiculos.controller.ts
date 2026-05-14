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
  Query,
} from '@nestjs/common';
import { TipoVeiculo } from '@prisma/client';
import { AtualizarVeiculoUseCase } from '../application/atualizar-veiculo.use-case';
import { BuscarVeiculoUseCase } from '../application/buscar-veiculo.use-case';
import { CadastrarVeiculoUseCase } from '../application/cadastrar-veiculo.use-case';
import { ListarVeiculosUseCase } from '../application/listar-veiculos.use-case';
import { RemoverVeiculoUseCase } from '../application/remover-veiculo.use-case';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';

@Controller('veiculos')
export class VeiculosController {
  constructor(
    private readonly cadastrarVeiculo: CadastrarVeiculoUseCase,
    private readonly listarVeiculos: ListarVeiculosUseCase,
    private readonly buscarVeiculo: BuscarVeiculoUseCase,
    private readonly atualizarVeiculo: AtualizarVeiculoUseCase,
    private readonly removerVeiculo: RemoverVeiculoUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateVeiculoDto) {
    return this.cadastrarVeiculo.executar(dto);
  }

  @Get()
  findAll(@Query('tipo') tipo?: TipoVeiculo, @Query('disponivel') disponivel?: string) {
    const disponivelBoolean =
      disponivel === 'true' ? true : disponivel === 'false' ? false : undefined;
    return this.listarVeiculos.executar({ tipo, disponivel: disponivelBoolean });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buscarVeiculo.executar(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVeiculoDto) {
    return this.atualizarVeiculo.executar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.removerVeiculo.executar(id);
  }
}
