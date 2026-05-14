import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { BuscarReservaUseCase } from '../application/buscar-reserva.use-case';
import { CancelarReservaUseCase } from '../application/cancelar-reserva.use-case';
import { CriarReservaUseCase } from '../application/criar-reserva.use-case';
import { ListarReservasUseCase } from '../application/listar-reservas.use-case';
import { CreateReservaDto } from './dto/create-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(
    private readonly criarReserva: CriarReservaUseCase,
    private readonly listarReservas: ListarReservasUseCase,
    private readonly buscarReserva: BuscarReservaUseCase,
    private readonly cancelarReserva: CancelarReservaUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReservaDto) {
    return this.criarReserva.executar(dto);
  }

  @Get()
  findAll() {
    return this.listarReservas.executar();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buscarReserva.executar(id);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.cancelarReserva.executar(id);
  }
}
