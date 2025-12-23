import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
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
    }),
    PrismaModule,
    ClientesModule,
    FuncionariosModule,
    VeiculosModule,
    CategoriasModule,
    ReservasModule,
    AlugueisModule,
    PagamentosModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
