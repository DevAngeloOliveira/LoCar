import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PAGAMENTO_REPOSITORY,
  PagamentoRepository,
} from '../domain/pagamento.repository';

@Injectable()
export class BuscarPagamentoUseCase {
  constructor(
    @Inject(PAGAMENTO_REPOSITORY)
    private readonly pagamentoRepository: PagamentoRepository,
  ) {}

  async executar(id: string) {
    const pagamento = await this.pagamentoRepository.buscarPorIdCompleto(id);
    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }
    return pagamento;
  }
}
