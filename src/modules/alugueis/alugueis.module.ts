import { Module } from '@nestjs/common';
import { ReservasModule } from '../reservas/reservas.module';
import { VeiculosModule } from '../veiculos/veiculos.module';
import { BuscarAluguelUseCase } from './application/buscar-aluguel.use-case';
import { CriarAluguelUseCase } from './application/criar-aluguel.use-case';
import { FinalizarAluguelUseCase } from './application/finalizar-aluguel.use-case';
import { ListarAlugueisUseCase } from './application/listar-alugueis.use-case';
import { ALUGUEL_REPOSITORY } from './domain/aluguel.repository';
import { PrismaAluguelRepository } from './infra/prisma-aluguel.repository';
import { AlugueisController } from './presentation/alugueis.controller';

@Module({
  imports: [ReservasModule, VeiculosModule],
  controllers: [AlugueisController],
  providers: [
    CriarAluguelUseCase,
    ListarAlugueisUseCase,
    BuscarAluguelUseCase,
    FinalizarAluguelUseCase,
    {
      provide: ALUGUEL_REPOSITORY,
      useClass: PrismaAluguelRepository,
    },
  ],
  exports: [BuscarAluguelUseCase],
})
export class AlugueisModule {}
