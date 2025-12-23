import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAluguelDto, FinalizarAluguelDto } from './dto/aluguel.dto';
import { ReservasService } from '../reservas/reservas.service';
import { VeiculosService } from '../veiculos/veiculos.service';

@Injectable()
export class AlugueisService {
  constructor(
    private prisma: PrismaService,
    private reservasService: ReservasService,
    private veiculosService: VeiculosService,
  ) {}

  /**
   * RF-BE-14: Converter reserva em aluguel
   * RF-BE-15: Calcular valor total
   * RN01: Veículo não pode participar de mais de um aluguel ativo
   */
  async create(createAluguelDto: CreateAluguelDto) {
    const { reservaId, veiculoId, dataInicio } = createAluguelDto;

    // Validar reserva pode gerar aluguel
    await this.reservasService.validarParaAluguel(reservaId);

    const reserva = await this.reservasService.findOne(reservaId);

    // Verificar se veículo está na reserva
    const veiculoNaReserva = reserva.veiculos.find((rv) => rv.veiculoId === veiculoId);
    if (!veiculoNaReserva) {
      throw new BadRequestException('Veículo não está incluído nesta reserva');
    }

    // RN01: Verificar se veículo já tem aluguel ativo
    const aluguelAtivo = await this.prisma.aluguel.findFirst({
      where: {
        veiculoId,
        finalizado: false,
      },
    });

    if (aluguelAtivo) {
      throw new BadRequestException('Veículo já possui aluguel ativo');
    }

    const veiculo = await this.veiculosService.findOne(veiculoId);

    // Calcular valor total baseado no período da reserva
    const inicio = dataInicio ? new Date(dataInicio) : reserva.dataInicio;
    const diasAluguel = Math.ceil(
      (reserva.dataFim.getTime() - reserva.dataInicio.getTime()) / (1000 * 60 * 60 * 24),
    );
    const valorTotal = diasAluguel * veiculo.valorDiaria;

    // Criar aluguel
    const aluguel = await this.prisma.aluguel.create({
      data: {
        dataInicio: inicio,
        valorTotal,
        reservaId,
        clienteId: reserva.clienteId,
        veiculoId,
      },
      include: {
        reserva: true,
        cliente: true,
        veiculo: true,
      },
    });

    // RF-BE-09: Marcar veículo como indisponível
    await this.veiculosService.setDisponibilidade(veiculoId, false);

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

  /**
   * RF-BE-16: Finalizar aluguel
   * RN02: Aluguel só pode ser finalizado após pagamento
   */
  async finalizar(id: string, finalizarAluguelDto: FinalizarAluguelDto) {
    const aluguel = await this.findOne(id);

    if (aluguel.finalizado) {
      throw new BadRequestException('Aluguel já está finalizado');
    }

    // RN02: Verificar se há pagamento
    if (!aluguel.pagamento) {
      throw new BadRequestException('Aluguel não pode ser finalizado sem pagamento');
    }

    const dataFim = new Date(finalizarAluguelDto.dataFim);

    if (dataFim < aluguel.dataInicio) {
      throw new BadRequestException('Data de fim não pode ser anterior à data de início');
    }

    // Atualizar aluguel
    const aluguelFinalizado = await this.prisma.aluguel.update({
      where: { id },
      data: {
        dataFim,
        finalizado: true,
      },
      include: {
        cliente: true,
        veiculo: true,
        reserva: true,
        pagamento: true,
      },
    });

    // RF-BE-09: Liberar veículo
    await this.veiculosService.setDisponibilidade(aluguel.veiculoId, true);

    return aluguelFinalizado;
  }
}
