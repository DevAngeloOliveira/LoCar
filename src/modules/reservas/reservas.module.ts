import { Module } from '@nestjs/common';
import { ClientesModule } from '../clientes/clientes.module';
import { FuncionariosModule } from '../funcionarios/funcionarios.module';
import { VeiculosModule } from '../veiculos/veiculos.module';
import { BuscarReservaUseCase } from './application/buscar-reserva.use-case';
import { CancelarReservaUseCase } from './application/cancelar-reserva.use-case';
import { CriarReservaUseCase } from './application/criar-reserva.use-case';
import { ListarReservasUseCase } from './application/listar-reservas.use-case';
import { ValidarReservaParaAluguelUseCase } from './application/validar-reserva-para-aluguel.use-case';
import { RESERVA_REPOSITORY } from './domain/reserva.repository';
import { PrismaReservaRepository } from './infra/prisma-reserva.repository';
import { ReservasController } from './presentation/reservas.controller';

@Module({
  imports: [VeiculosModule, ClientesModule, FuncionariosModule],
  controllers: [ReservasController],
  providers: [
    CriarReservaUseCase,
    ListarReservasUseCase,
    BuscarReservaUseCase,
    CancelarReservaUseCase,
    ValidarReservaParaAluguelUseCase,
    {
      provide: RESERVA_REPOSITORY,
      useClass: PrismaReservaRepository,
    },
  ],
  exports: [BuscarReservaUseCase, ValidarReservaParaAluguelUseCase],
})
export class ReservasModule {}
