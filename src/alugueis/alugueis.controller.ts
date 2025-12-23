import { Controller, Get, Post, Body, Param, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { AlugueisService } from './alugueis.service';
import { CreateAluguelDto, FinalizarAluguelDto } from './dto/aluguel.dto';

@Controller('alugueis')
export class AlugueisController {
  constructor(private readonly alugueisService: AlugueisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAluguelDto: CreateAluguelDto) {
    return this.alugueisService.create(createAluguelDto);
  }

  @Get()
  findAll() {
    return this.alugueisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alugueisService.findOne(id);
  }

  @Patch(':id/finalizar')
  finalizar(@Param('id') id: string, @Body() finalizarAluguelDto: FinalizarAluguelDto) {
    return this.alugueisService.finalizar(id, finalizarAluguelDto);
  }
}
