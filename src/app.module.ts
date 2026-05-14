import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './shared/config/configuration';
import { PrismaModule } from './shared/database/prisma.module';
import { HealthModule } from './health/health.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { FuncionariosModule } from './modules/funcionarios/funcionarios.module';
import { VeiculosModule } from './modules/veiculos/veiculos.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ReservasModule } from './modules/reservas/reservas.module';
import { AlugueisModule } from './modules/alugueis/alugueis.module';
import { PagamentosModule } from './modules/pagamentos/pagamentos.module';

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
