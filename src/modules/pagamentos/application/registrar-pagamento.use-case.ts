import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { BuscarAluguelUseCase } from '../../alugueis/application/buscar-aluguel.use-case';
import { PAGAMENTO_REPOSITORY, PagamentoRepository } from '../domain/pagamento.repository';
import { CreatePagamentoDto } from '../presentation/dto/create-pagamento.dto';

@Injectable()
export class RegistrarPagamentoUseCase {
  constructor(
    @Inject(PAGAMENTO_REPOSITORY)
    private readonly pagamentoRepository: PagamentoRepository,
    private readonly buscarAluguel: BuscarAluguelUseCase,
  ) {}

  async executar(dto: CreatePagamentoDto) {
    const aluguel = await this.buscarAluguel.executar(dto.aluguelId);

    if (aluguel.pagamento) {
      throw new ConflictException('Aluguel já possui pagamento registrado');
    }

    if (aluguel.finalizado) {
      throw new BadRequestException('Não é possível registrar pagamento para aluguel finalizado');
    }

    if (dto.valor < aluguel.valorTotal) {
      throw new BadRequestException(
        `Valor do pagamento (R$ ${dto.valor}) é inferior ao valor total do aluguel (R$ ${aluguel.valorTotal})`,
      );
    }

    return this.pagamentoRepository.criar({
      tipo: dto.tipo,
      valor: dto.valor,
      aluguelId: dto.aluguelId,
    });
  }
}
