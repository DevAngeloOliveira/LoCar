import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaDto } from './dto/reserva.dto';
import { VeiculosService } from '../veiculos/veiculos.service';
import { ClientesService } from '../clientes/clientes.service';
import { FuncionariosService } from '../funcionarios/funcionarios.service';

@Injectable()
export class ReservasService {
  constructor(
    private prisma: PrismaService,
    private veiculosService: VeiculosService,
    private clientesService: ClientesService,
    private funcionariosService: FuncionariosService,
  ) {}

  /**
   * RF-BE-11: Criar reserva
   * RF-BE-12: Validar conflitos de período e disponibilidade
   */
  async create(createReservaDto: CreateReservaDto) {
    const { dataInicio, dataFim, clienteId, funcionarioId, veiculoIds } = createReservaDto;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // Validar datas
    if (inicio >= fim) {
      throw new BadRequestException('Data de início deve ser anterior à data de fim');
    }

    if (inicio < new Date()) {
      throw new BadRequestException('Data de início não pode ser no passado');
    }

    // Validar cliente existe
    await this.clientesService.findOne(clienteId);

    // RF-BE-06: Validar funcionário ativo
    await this.funcionariosService.validateFuncionarioAtivo(funcionarioId);

    // Validar disponibilidade de cada veículo
    for (const veiculoId of veiculoIds) {
      const disponivel = await this.veiculosService.verificarDisponibilidade(
        veiculoId,
        inicio,
        fim,
      );

      if (!disponivel) {
        const veiculo = await this.veiculosService.findOne(veiculoId);
        throw new BadRequestException(
          `Veículo ${veiculo.modelo} não disponível para o período selecionado`,
        );
      }
    }

    // Criar reserva com veículos
    const reserva = await this.prisma.reserva.create({
      data: {
        dataInicio: inicio,
        dataFim: fim,
        clienteId,
        funcionarioId,
        veiculos: {
          create: veiculoIds.map((veiculoId) => ({
            veiculoId,
          })),
        },
      },
      include: {
        cliente: true,
        funcionario: true,
        veiculos: {
          include: { veiculo: true },
        },
      },
    });

    return reserva;
  }

  async findAll() {
    return this.prisma.reserva.findMany({
      include: {
        cliente: true,
        funcionario: true,
        veiculos: {
          include: { veiculo: true },
        },
      },
      orderBy: { dataReserva: 'desc' },
    });
  }

  async findOne(id: string) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: {
        cliente: true,
        funcionario: true,
        veiculos: {
          include: { veiculo: true },
        },
        aluguel: true,
      },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }

    return reserva;
  }

  /**
   * RF-BE-13: Cancelar reserva
   * RN03: Reserva cancelada não pode gerar aluguel
   */
  async cancelar(id: string) {
    const reserva = await this.findOne(id);

    if (reserva.cancelada) {
      throw new BadRequestException('Reserva já está cancelada');
    }

    if (reserva.aluguel) {
      throw new BadRequestException('Não é possível cancelar reserva com aluguel associado');
    }

    return this.prisma.reserva.update({
      where: { id },
      data: { cancelada: true },
      include: {
        cliente: true,
        funcionario: true,
        veiculos: {
          include: { veiculo: true },
        },
      },
    });
  }

  /**
   * Verificar se reserva pode gerar aluguel
   */
  async validarParaAluguel(id: string): Promise<void> {
    const reserva = await this.findOne(id);

    if (reserva.cancelada) {
      throw new BadRequestException('Reserva cancelada não pode gerar aluguel');
    }

    if (reserva.aluguel) {
      throw new BadRequestException('Reserva já possui aluguel associado');
    }
  }
}
