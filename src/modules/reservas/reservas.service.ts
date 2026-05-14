import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { BuscarClienteUseCase } from '../clientes/application/buscar-cliente.use-case';
import { ValidarFuncionarioAtivoUseCase } from '../funcionarios/application/validar-funcionario-ativo.use-case';
import { BuscarVeiculoUseCase } from '../veiculos/application/buscar-veiculo.use-case';
import { VerificarDisponibilidadeUseCase } from '../veiculos/application/verificar-disponibilidade.use-case';
import { CreateReservaDto } from './dto/reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarCliente: BuscarClienteUseCase,
    private readonly validarFuncionarioAtivo: ValidarFuncionarioAtivoUseCase,
    private readonly buscarVeiculo: BuscarVeiculoUseCase,
    private readonly verificarDisponibilidade: VerificarDisponibilidadeUseCase,
  ) {}

  async create(createReservaDto: CreateReservaDto) {
    const { dataInicio, dataFim, clienteId, funcionarioId, veiculoIds } =
      createReservaDto;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (inicio >= fim) {
      throw new BadRequestException(
        'Data de início deve ser anterior à data de fim',
      );
    }

    if (inicio < new Date()) {
      throw new BadRequestException('Data de início não pode ser no passado');
    }

    await this.buscarCliente.executar(clienteId);
    await this.validarFuncionarioAtivo.executar(funcionarioId);

    for (const veiculoId of veiculoIds) {
      const disponivel = await this.verificarDisponibilidade.executar(
        veiculoId,
        inicio,
        fim,
      );

      if (!disponivel) {
        const veiculo = await this.buscarVeiculo.garantirExistencia(veiculoId);
        throw new BadRequestException(
          `Veículo ${veiculo.modelo} não disponível para o período selecionado`,
        );
      }
    }

    return this.prisma.reserva.create({
      data: {
        dataInicio: inicio,
        dataFim: fim,
        clienteId,
        funcionarioId,
        veiculos: {
          create: veiculoIds.map((veiculoId) => ({ veiculoId })),
        },
      },
      include: {
        cliente: true,
        funcionario: true,
        veiculos: { include: { veiculo: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.reserva.findMany({
      include: {
        cliente: true,
        funcionario: true,
        veiculos: { include: { veiculo: true } },
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
        veiculos: { include: { veiculo: true } },
        aluguel: true,
      },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }

    return reserva;
  }

  async cancelar(id: string) {
    const reserva = await this.findOne(id);

    if (reserva.cancelada) {
      throw new BadRequestException('Reserva já está cancelada');
    }

    if (reserva.aluguel) {
      throw new BadRequestException(
        'Não é possível cancelar reserva com aluguel associado',
      );
    }

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

  async validarParaAluguel(id: string): Promise<void> {
    const reserva = await this.findOne(id);

    if (reserva.cancelada) {
      throw new BadRequestException(
        'Reserva cancelada não pode gerar aluguel',
      );
    }

    if (reserva.aluguel) {
      throw new BadRequestException('Reserva já possui aluguel associado');
    }
  }
}
