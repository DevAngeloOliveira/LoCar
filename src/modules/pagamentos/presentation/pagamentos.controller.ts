import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BuscarPagamentoPorAluguelUseCase } from '../application/buscar-pagamento-por-aluguel.use-case';
import { BuscarPagamentoUseCase } from '../application/buscar-pagamento.use-case';
import { ListarPagamentosUseCase } from '../application/listar-pagamentos.use-case';
import { RegistrarPagamentoUseCase } from '../application/registrar-pagamento.use-case';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';

@Controller('pagamentos')
export class PagamentosController {
  constructor(
    private readonly registrarPagamento: RegistrarPagamentoUseCase,
    private readonly listarPagamentos: ListarPagamentosUseCase,
    private readonly buscarPagamento: BuscarPagamentoUseCase,
    private readonly buscarPagamentoPorAluguel: BuscarPagamentoPorAluguelUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePagamentoDto) {
    return this.registrarPagamento.executar(dto);
  }

  @Get()
  findAll() {
    return this.listarPagamentos.executar();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buscarPagamento.executar(id);
  }

  @Get('aluguel/:aluguelId')
  findByAluguel(@Param('aluguelId') aluguelId: string) {
    return this.buscarPagamentoPorAluguel.executar(aluguelId);
  }
}
