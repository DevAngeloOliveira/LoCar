import { Module } from '@nestjs/common';
import { AtualizarClienteUseCase } from './application/atualizar-cliente.use-case';
import { BuscarClienteUseCase } from './application/buscar-cliente.use-case';
import { CadastrarClienteUseCase } from './application/cadastrar-cliente.use-case';
import { DesativarClienteUseCase } from './application/desativar-cliente.use-case';
import { ListarClientesUseCase } from './application/listar-clientes.use-case';
import { CLIENTE_REPOSITORY } from './domain/cliente.repository';
import { PrismaClienteRepository } from './infra/prisma-cliente.repository';
import { ClientesController } from './presentation/clientes.controller';

@Module({
  controllers: [ClientesController],
  providers: [
    CadastrarClienteUseCase,
    ListarClientesUseCase,
    BuscarClienteUseCase,
    AtualizarClienteUseCase,
    DesativarClienteUseCase,
    {
      provide: CLIENTE_REPOSITORY,
      useClass: PrismaClienteRepository,
    },
  ],
  exports: [BuscarClienteUseCase],
})
export class ClientesModule {}
