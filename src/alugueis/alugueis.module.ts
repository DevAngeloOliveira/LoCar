import { Module } from '@nestjs/common';
import { AlugueisService } from './alugueis.service';
import { AlugueisController } from './alugueis.controller';
import { ReservasModule } from '../reservas/reservas.module';
import { VeiculosModule } from '../veiculos/veiculos.module';

@Module({
  imports: [ReservasModule, VeiculosModule],
  controllers: [AlugueisController],
  providers: [AlugueisService],
  exports: [AlugueisService],
})
export class AlugueisModule {}
