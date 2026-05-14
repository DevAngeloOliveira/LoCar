import { Module } from '@nestjs/common';
import { AlugueisModule } from '../alugueis/alugueis.module';
import { BuscarPagamentoPorAluguelUseCase } from './application/buscar-pagamento-por-aluguel.use-case';
import { BuscarPagamentoUseCase } from './application/buscar-pagamento.use-case';
import { ListarPagamentosUseCase } from './application/listar-pagamentos.use-case';
import { RegistrarPagamentoUseCase } from './application/registrar-pagamento.use-case';
import { PAGAMENTO_REPOSITORY } from './domain/pagamento.repository';
import { PrismaPagamentoRepository } from './infra/prisma-pagamento.repository';
import { PagamentosController } from './presentation/pagamentos.controller';

@Module({
  imports: [AlugueisModule],
  controllers: [PagamentosController],
  providers: [
    RegistrarPagamentoUseCase,
    ListarPagamentosUseCase,
    BuscarPagamentoUseCase,
    BuscarPagamentoPorAluguelUseCase,
    {
      provide: PAGAMENTO_REPOSITORY,
      useClass: PrismaPagamentoRepository,
    },
  ],
})
export class PagamentosModule {}
