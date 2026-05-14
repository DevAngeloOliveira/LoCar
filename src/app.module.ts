import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './shared/config/configuration';
import { PrismaModule } from './shared/database/prisma.module';
import { HealthModule } from './health/health.module';
import { ClientesModule } from './clientes/clientes.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { VeiculosModule } from './veiculos/veiculos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ReservasModule } from './reservas/reservas.module';
import { AlugueisModule } from './alugueis/alugueis.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    ClientesModule,
    FuncionariosModule,
    VeiculosModule,
    CategoriasModule,
    ReservasModule,
    AlugueisModule,
    PagamentosModule,
  ],
})
export class AppModule {}
