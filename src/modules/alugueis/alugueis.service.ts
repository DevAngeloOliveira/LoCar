import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { ReservasService } from '../reservas/reservas.service';
import { AlterarDisponibilidadeUseCase } from '../veiculos/application/alterar-disponibilidade.use-case';
import { BuscarVeiculoUseCase } from '../veiculos/application/buscar-veiculo.use-case';
import { CreateAluguelDto, FinalizarAluguelDto } from './dto/aluguel.dto';

@Injectable()
export class AlugueisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reservasService: ReservasService,
    private readonly buscarVeiculo: BuscarVeiculoUseCase,
    private readonly alterarDisponibilidade: AlterarDisponibilidadeUseCase,
  ) {}

  async create(createAluguelDto: CreateAluguelDto) {
    const { reservaId, veiculoId, dataInicio } = createAluguelDto;

    await this.reservasService.validarParaAluguel(reservaId);
    const reserva = await this.reservasService.findOne(reservaId);

    const veiculoNaReserva = reserva.veiculos.find(
      (rv) => rv.veiculoId === veiculoId,
    );
    if (!veiculoNaReserva) {
      throw new BadRequestException('Veículo não está incluído nesta reserva');
    }

    const aluguelAtivo = await this.prisma.aluguel.findFirst({
      where: { veiculoId, finalizado: false },
    });
    if (aluguelAtivo) {
      throw new BadRequestException('Veículo já possui aluguel ativo');
    }

    const veiculo = await this.buscarVeiculo.garantirExistencia(veiculoId);

    const inicio = dataInicio ? new Date(dataInicio) : reserva.dataInicio;
    const diasAluguel = Math.ceil(
      (reserva.dataFim.getTime() - reserva.dataInicio.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const valorTotal = diasAluguel * veiculo.valorDiaria;

    const aluguel = await this.prisma.aluguel.create({
      data: {
        dataInicio: inicio,
        valorTotal,
        reservaId,
        clienteId: reserva.clienteId,
        veiculoId,
      },
      include: { reserva: true, cliente: true, veiculo: true },
    });

    await this.alterarDisponibilidade.executar(veiculoId, false);

    return aluguel;
  }

  async findAll() {
    return this.prisma.aluguel.findMany({
      include: {
        cliente: true,
        veiculo: true,
        reserva: true,
        pagamento: true,
      },
      orderBy: { dataInicio: 'desc' },
    });
  }

  async findOne(id: string) {
    const aluguel = await this.prisma.aluguel.findUnique({
      where: { id },
      include: {
        cliente: true,
        veiculo: true,
        reserva: true,
        pagamento: true,
      },
    });

    if (!aluguel) {
      throw new NotFoundException('Aluguel não encontrado');
    }

    return aluguel;
  }

  async finalizar(id: string, finalizarAluguelDto: FinalizarAluguelDto) {
    const aluguel = await this.findOne(id);

    if (aluguel.finalizado) {
      throw new BadRequestException('Aluguel já está finalizado');
    }

    if (!aluguel.pagamento) {
      throw new BadRequestException(
        'Aluguel não pode ser finalizado sem pagamento',
      );
    }

    const dataFim = new Date(finalizarAluguelDto.dataFim);
    if (dataFim < aluguel.dataInicio) {
      throw new BadRequestException(
        'Data de fim não pode ser anterior à data de início',
      );
    }

    const aluguelFinalizado = await this.prisma.aluguel.update({
      where: { id },
      data: { dataFim, finalizado: true },
      include: {
        cliente: true,
        veiculo: true,
        reserva: true,
        pagamento: true,
      },
    });

    await this.alterarDisponibilidade.executar(aluguel.veiculoId, true);

    return aluguelFinalizado;
  }
}
