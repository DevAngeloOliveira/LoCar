import { Inject, Injectable } from '@nestjs/common';
import {
  PAGAMENTO_REPOSITORY,
  PagamentoRepository,
} from '../domain/pagamento.repository';

@Injectable()
export class BuscarPagamentoPorAluguelUseCase {
  constructor(
    @Inject(PAGAMENTO_REPOSITORY)
    private readonly pagamentoRepository: PagamentoRepository,
  ) {}

  executar(aluguelId: string) {
    return this.pagamentoRepository.buscarPorAluguel(aluguelId);
  }
}
