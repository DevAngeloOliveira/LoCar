import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { AluguelComRelacoes, CriarAluguelInput } from '../domain/aluguel.entity';
import { AluguelRepository } from '../domain/aluguel.repository';

const includeCompleto = {
  cliente: true,
  veiculo: true,
  reserva: true,
  pagamento: true,
} as const;

@Injectable()
export class PrismaAluguelRepository implements AluguelRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPorIdCompleto(id: string): Promise<AluguelComRelacoes | null> {
    return this.prisma.aluguel.findUnique({
      where: { id },
      include: includeCompleto,
    }) as Promise<AluguelComRelacoes | null>;
  }

  listar() {
    return this.prisma.aluguel.findMany({
      include: includeCompleto,
      orderBy: { dataInicio: 'desc' },
    });
  }

  criarComBloqueioDeVeiculo(input: CriarAluguelInput) {
    return this.prisma.$transaction(async (tx) => {
      const aluguelAtivo = await tx.aluguel.findFirst({
        where: { veiculoId: input.veiculoId, finalizado: false },
        select: { id: true },
      });
      if (aluguelAtivo) {
        throw new BadRequestException('Veículo já possui aluguel ativo');
      }

      const aluguel = await tx.aluguel.create({
        data: {
          dataInicio: input.dataInicio,
          valorTotal: input.valorTotal,
          reservaId: input.reservaId,
          clienteId: input.clienteId,
          veiculoId: input.veiculoId,
        },
        include: { reserva: true, cliente: true, veiculo: true },
      });

      await tx.veiculo.update({
        where: { id: input.veiculoId },
        data: { disponivel: false },
      });

      return aluguel;
    });
  }

  finalizarComLiberacaoDeVeiculo(
    id: string,
    dataFim: Date,
    veiculoId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const aluguelFinalizado = await tx.aluguel.update({
        where: { id },
        data: { dataFim, finalizado: true },
        include: includeCompleto,
      });

      await tx.veiculo.update({
        where: { id: veiculoId },
        data: { disponivel: true },
      });

      return aluguelFinalizado;
    });
  }
}
