import { Module } from '@nestjs/common';
import { CategoriasModule } from '../categorias/categorias.module';
import { AlterarDisponibilidadeUseCase } from './application/alterar-disponibilidade.use-case';
import { AtualizarVeiculoUseCase } from './application/atualizar-veiculo.use-case';
import { BuscarVeiculoUseCase } from './application/buscar-veiculo.use-case';
import { CadastrarVeiculoUseCase } from './application/cadastrar-veiculo.use-case';
import { ListarVeiculosUseCase } from './application/listar-veiculos.use-case';
import { RemoverVeiculoUseCase } from './application/remover-veiculo.use-case';
import { VerificarDisponibilidadeUseCase } from './application/verificar-disponibilidade.use-case';
import { VEICULO_REPOSITORY } from './domain/veiculo.repository';
import { PrismaVeiculoRepository } from './infra/prisma-veiculo.repository';
import { VeiculosController } from './presentation/veiculos.controller';

@Module({
  imports: [CategoriasModule],
  controllers: [VeiculosController],
  providers: [
    CadastrarVeiculoUseCase,
    ListarVeiculosUseCase,
    BuscarVeiculoUseCase,
    AtualizarVeiculoUseCase,
    RemoverVeiculoUseCase,
    AlterarDisponibilidadeUseCase,
    VerificarDisponibilidadeUseCase,
    {
      provide: VEICULO_REPOSITORY,
      useClass: PrismaVeiculoRepository,
    },
  ],
  exports: [BuscarVeiculoUseCase, AlterarDisponibilidadeUseCase, VerificarDisponibilidadeUseCase],
})
export class VeiculosModule {}
