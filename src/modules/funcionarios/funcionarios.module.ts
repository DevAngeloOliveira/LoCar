import { Module } from '@nestjs/common';
import { AtualizarFuncionarioUseCase } from './application/atualizar-funcionario.use-case';
import { BuscarFuncionarioUseCase } from './application/buscar-funcionario.use-case';
import { CadastrarFuncionarioUseCase } from './application/cadastrar-funcionario.use-case';
import { DesativarFuncionarioUseCase } from './application/desativar-funcionario.use-case';
import { ListarFuncionariosUseCase } from './application/listar-funcionarios.use-case';
import { ValidarFuncionarioAtivoUseCase } from './application/validar-funcionario-ativo.use-case';
import { FUNCIONARIO_REPOSITORY } from './domain/funcionario.repository';
import { PrismaFuncionarioRepository } from './infra/prisma-funcionario.repository';
import { FuncionariosController } from './presentation/funcionarios.controller';

@Module({
  controllers: [FuncionariosController],
  providers: [
    CadastrarFuncionarioUseCase,
    ListarFuncionariosUseCase,
    BuscarFuncionarioUseCase,
    AtualizarFuncionarioUseCase,
    DesativarFuncionarioUseCase,
    ValidarFuncionarioAtivoUseCase,
    {
      provide: FUNCIONARIO_REPOSITORY,
      useClass: PrismaFuncionarioRepository,
    },
  ],
  exports: [BuscarFuncionarioUseCase, ValidarFuncionarioAtivoUseCase],
})
export class FuncionariosModule {}
