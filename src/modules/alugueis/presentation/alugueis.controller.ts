import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BuscarAluguelUseCase } from '../application/buscar-aluguel.use-case';
import { CriarAluguelUseCase } from '../application/criar-aluguel.use-case';
import { FinalizarAluguelUseCase } from '../application/finalizar-aluguel.use-case';
import { ListarAlugueisUseCase } from '../application/listar-alugueis.use-case';
import { CreateAluguelDto } from './dto/create-aluguel.dto';
import { FinalizarAluguelDto } from './dto/finalizar-aluguel.dto';

@Controller('alugueis')
export class AlugueisController {
  constructor(
    private readonly criarAluguel: CriarAluguelUseCase,
    private readonly listarAlugueis: ListarAlugueisUseCase,
    private readonly buscarAluguel: BuscarAluguelUseCase,
    private readonly finalizarAluguel: FinalizarAluguelUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAluguelDto) {
    return this.criarAluguel.executar(dto);
  }

  @Get()
  findAll() {
    return this.listarAlugueis.executar();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buscarAluguel.executar(id);
  }

  @Patch(':id/finalizar')
  finalizar(@Param('id') id: string, @Body() dto: FinalizarAluguelDto) {
    return this.finalizarAluguel.executar(id, dto);
  }
}
