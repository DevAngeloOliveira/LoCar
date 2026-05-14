import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { CriarReservaInput } from '../domain/reserva.entity';
import { ReservaCompleta, ReservaRepository } from '../domain/reserva.repository';

const includeCompleto = {
  cliente: true,
  funcionario: true,
  veiculos: { include: { veiculo: true } },
  aluguel: true,
} as const;

@Injectable()
export class PrismaReservaRepository implements ReservaRepository {
  constructor(private readonly prisma: PrismaService) {}

  criarComVeiculos(dados: CriarReservaInput) {
    return this.prisma.$transaction(async (tx) => {
      for (const veiculoId of dados.veiculoIds) {
        const conflito = await tx.reserva.findFirst({
          where: {
            cancelada: false,
            veiculos: { some: { veiculoId } },
            OR: [
              {
                AND: [
                  { dataInicio: { lte: dados.dataInicio } },
                  { dataFim: { gte: dados.dataInicio } },
                ],
              },
              {
                AND: [{ dataInicio: { lte: dados.dataFim } }, { dataFim: { gte: dados.dataFim } }],
              },
              {
                AND: [
                  { dataInicio: { gte: dados.dataInicio } },
                  { dataFim: { lte: dados.dataFim } },
                ],
              },
            ],
          },
          select: { id: true },
        });
        if (conflito) {
          throw new Error(`Conflito de período para veículo ${veiculoId}`);
        }
      }

      return tx.reserva.create({
        data: {
          dataInicio: dados.dataInicio,
          dataFim: dados.dataFim,
          clienteId: dados.clienteId,
          funcionarioId: dados.funcionarioId,
          veiculos: {
            create: dados.veiculoIds.map((veiculoId) => ({ veiculoId })),
          },
        },
        include: {
          cliente: true,
          funcionario: true,
          veiculos: { include: { veiculo: true } },
        },
      });
    });
  }

  listar() {
    return this.prisma.reserva.findMany({
      include: {
        cliente: true,
        funcionario: true,
        veiculos: { include: { veiculo: true } },
      },
      orderBy: { dataReserva: 'desc' },
    });
  }

  buscarPorIdCompleto(id: string): Promise<ReservaCompleta | null> {
    return this.prisma.reserva.findUnique({
      where: { id },
      include: includeCompleto,
    }) as Promise<ReservaCompleta | null>;
  }

  cancelar(id: string) {
    return this.prisma.reserva.update({
      where: { id },
      data: { cancelada: true },
      include: {
        cliente: true,
        funcionario: true,
        veiculos: { include: { veiculo: true } },
      },
    });
  }

  async existeConflitoDePeriodo(
    veiculoId: string,
    dataInicio: Date,
    dataFim: Date,
  ): Promise<boolean> {
    const conflito = await this.prisma.reserva.findFirst({
      where: {
        cancelada: false,
        veiculos: { some: { veiculoId } },
        OR: [
          { AND: [{ dataInicio: { lte: dataInicio } }, { dataFim: { gte: dataInicio } }] },
          { AND: [{ dataInicio: { lte: dataFim } }, { dataFim: { gte: dataFim } }] },
          { AND: [{ dataInicio: { gte: dataInicio } }, { dataFim: { lte: dataFim } }] },
        ],
      },
      select: { id: true },
    });
    return conflito !== null;
  }
}
