import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { VeiculosModule } from '../veiculos/veiculos.module';
import { ClientesModule } from '../clientes/clientes.module';
import { FuncionariosModule } from '../funcionarios/funcionarios.module';

@Module({
  imports: [VeiculosModule, ClientesModule, FuncionariosModule],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}
