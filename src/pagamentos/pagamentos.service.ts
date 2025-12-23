import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/pagamento.dto';
import { AlugueisService } from '../alugueis/alugueis.service';

@Injectable()
export class PagamentosService {
  constructor(
    private prisma: PrismaService,
    private alugueisService: AlugueisService,
  ) {}

  /**
   * RF-BE-17: Gerar exatamente um pagamento por aluguel
   * RF-BE-18: Registrar tipo, valor e data do pagamento
   */
  async create(createPagamentoDto: CreatePagamentoDto) {
    const { aluguelId, tipo, valor } = createPagamentoDto;

    const aluguel = await this.alugueisService.findOne(aluguelId);

    // RF-BE-17: Verificar se aluguel já tem pagamento
    if (aluguel.pagamento) {
      throw new ConflictException('Aluguel já possui pagamento registrado');
    }

    // Verificar se aluguel está finalizado
    if (aluguel.finalizado) {
      throw new BadRequestException('Não é possível registrar pagamento para aluguel finalizado');
    }

    // Validar valor do pagamento
    if (valor < aluguel.valorTotal) {
      throw new BadRequestException(
        `Valor do pagamento (R$ ${valor}) é inferior ao valor total do aluguel (R$ ${aluguel.valorTotal})`,
      );
    }

    return this.prisma.pagamento.create({
      data: {
        tipo,
        valor,
        aluguelId,
      },
      include: {
        aluguel: {
          include: {
            cliente: true,
            veiculo: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.pagamento.findMany({
      include: {
        aluguel: {
          include: {
            cliente: true,
            veiculo: true,
          },
        },
      },
      orderBy: { dataPagamento: 'desc' },
    });
  }

  async findOne(id: string) {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: { id },
      include: {
        aluguel: {
          include: {
            cliente: true,
            veiculo: true,
            reserva: true,
          },
        },
      },
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return pagamento;
  }

  async findByAluguel(aluguelId: string) {
    return this.prisma.pagamento.findUnique({
      where: { aluguelId },
      include: {
        aluguel: true,
      },
    });
  }
}
