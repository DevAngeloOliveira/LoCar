import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { VeiculosService } from './veiculos.service';
import { CreateVeiculoDto, UpdateVeiculoDto } from './dto/veiculo.dto';
import { TipoVeiculo } from '@prisma/client';

@Controller('veiculos')
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVeiculoDto: CreateVeiculoDto) {
    return this.veiculosService.create(createVeiculoDto);
  }

  @Get()
  findAll(
    @Query('tipo') tipo?: TipoVeiculo,
    @Query('disponivel') disponivel?: string,
  ) {
    const disponivelBoolean = disponivel === 'true' ? true : disponivel === 'false' ? false : undefined;
    return this.veiculosService.findAll(tipo, disponivelBoolean);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.veiculosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVeiculoDto: UpdateVeiculoDto) {
    return this.veiculosService.update(id, updateVeiculoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.veiculosService.remove(id);
  }
}
