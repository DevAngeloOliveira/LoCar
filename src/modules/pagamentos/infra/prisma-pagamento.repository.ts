import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { CriarPagamentoInput, Pagamento } from '../domain/pagamento.entity';
import { PagamentoRepository } from '../domain/pagamento.repository';

@Injectable()
export class PrismaPagamentoRepository implements PagamentoRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPorIdCompleto(id: string) {
    return this.prisma.pagamento.findUnique({
      where: { id },
      include: {
        aluguel: {
          include: { cliente: true, veiculo: true, reserva: true },
        },
      },
    });
  }

  buscarPorAluguel(aluguelId: string): Promise<Pagamento | null> {
    return this.prisma.pagamento.findUnique({
      where: { aluguelId },
    }) as Promise<Pagamento | null>;
  }

  listar() {
    return this.prisma.pagamento.findMany({
      include: {
        aluguel: { include: { cliente: true, veiculo: true } },
      },
      orderBy: { dataPagamento: 'desc' },
    });
  }

  criar(input: CriarPagamentoInput) {
    return this.prisma.pagamento.create({
      data: input,
      include: {
        aluguel: { include: { cliente: true, veiculo: true } },
      },
    });
  }
}
