import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { Veiculo, VeiculoAtualizacao, VeiculoCriacao } from '../domain/veiculo.entity';
import { FiltroListarVeiculos, VeiculoRepository } from '../domain/veiculo.repository';

@Injectable()
export class PrismaVeiculoRepository implements VeiculoRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPorId(id: string): Promise<Veiculo | null> {
    return this.prisma.veiculo.findUnique({ where: { id } }) as Promise<Veiculo | null>;
  }

  buscarPorIdCompleto(id: string) {
    return this.prisma.veiculo.findUnique({
      where: { id },
      include: {
        categoria: true,
        reservaVeiculos: { include: { reserva: true } },
      },
    });
  }

  buscarPorPlaca(placa: string): Promise<Veiculo | null> {
    return this.prisma.veiculo.findUnique({ where: { placa } }) as Promise<Veiculo | null>;
  }

  listar(filtro: FiltroListarVeiculos) {
    return this.prisma.veiculo.findMany({
      where: {
        ...(filtro.tipo && { tipo: filtro.tipo }),
        ...(filtro.disponivel !== undefined && { disponivel: filtro.disponivel }),
      },
      include: { categoria: true },
      orderBy: { modelo: 'asc' },
    });
  }

  criar(dados: VeiculoCriacao) {
    return this.prisma.veiculo.create({
      data: dados,
      include: { categoria: true },
    });
  }

  atualizar(id: string, dados: VeiculoAtualizacao) {
    return this.prisma.veiculo.update({
      where: { id },
      data: dados,
      include: { categoria: true },
    });
  }

  alterarDisponibilidade(id: string, disponivel: boolean): Promise<Veiculo> {
    return this.prisma.veiculo.update({
      where: { id },
      data: { disponivel },
    }) as Promise<Veiculo>;
  }

  remover(id: string): Promise<Veiculo> {
    return this.prisma.veiculo.delete({ where: { id } }) as Promise<Veiculo>;
  }

  async contarAlugueisAtivos(veiculoId: string): Promise<number> {
    return this.prisma.aluguel.count({
      where: { veiculoId, finalizado: false },
    });
  }

  async existeConflitoDeReserva(
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
