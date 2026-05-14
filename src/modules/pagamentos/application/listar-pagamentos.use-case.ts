import { Inject, Injectable } from '@nestjs/common';
import {
  PAGAMENTO_REPOSITORY,
  PagamentoRepository,
} from '../domain/pagamento.repository';

@Injectable()
export class ListarPagamentosUseCase {
  constructor(
    @Inject(PAGAMENTO_REPOSITORY)
    private readonly pagamentoRepository: PagamentoRepository,
  ) {}

  executar() {
    return this.pagamentoRepository.listar();
  }
}
