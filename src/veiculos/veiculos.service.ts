import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVeiculoDto, UpdateVeiculoDto } from './dto/veiculo.dto';
import { TipoVeiculo } from '@prisma/client';

@Injectable()
export class VeiculosService {
  constructor(private prisma: PrismaService) {}

  /**
   * RF-BE-07: Cadastrar veículo
   * RF-BE-08: Valida unicidade da placa
   */
  async create(createVeiculoDto: CreateVeiculoDto) {
    const veiculoExistente = await this.prisma.veiculo.findUnique({
      where: { placa: createVeiculoDto.placa },
    });

    if (veiculoExistente) {
      throw new ConflictException('Placa já cadastrada no sistema');
    }

    // Validar categoria existe
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: createVeiculoDto.categoriaId },
    });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return this.prisma.veiculo.create({
      data: createVeiculoDto,
      include: { categoria: true },
    });
  }

  /**
   * RF-BE-10: Listar veículos com filtros
   */
  async findAll(tipo?: TipoVeiculo, disponivel?: boolean) {
    return this.prisma.veiculo.findMany({
      where: {
        ...(tipo && { tipo }),
        ...(disponivel !== undefined && { disponivel }),
      },
      include: { categoria: true },
      orderBy: { modelo: 'asc' },
    });
  }

  async findOne(id: string) {
    const veiculo = await this.prisma.veiculo.findUnique({
      where: { id },
      include: {
        categoria: true,
        reservaVeiculos: {
          include: { reserva: true },
        },
      },
    });

    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }

    return veiculo;
  }

  /**
   * RF-BE-09: Controlar disponibilidade do veículo
   */
  async setDisponibilidade(id: string, disponivel: boolean) {
    await this.findOne(id);

    return this.prisma.veiculo.update({
      where: { id },
      data: { disponivel },
    });
  }

  /**
   * Verificar se veículo está disponível para período
   */
  async verificarDisponibilidade(veiculoId: string, dataInicio: Date, dataFim: Date): Promise<boolean> {
    const veiculo = await this.findOne(veiculoId);

    if (!veiculo.disponivel) {
      return false;
    }

    // Verificar se há reservas ativas no período
    const reservasConflitantes = await this.prisma.reserva.findMany({
      where: {
        cancelada: false,
        veiculos: {
          some: {
            veiculoId,
          },
        },
        OR: [
          {
            AND: [
              { dataInicio: { lte: dataInicio } },
              { dataFim: { gte: dataInicio } },
            ],
          },
          {
            AND: [
              { dataInicio: { lte: dataFim } },
              { dataFim: { gte: dataFim } },
            ],
          },
          {
            AND: [
              { dataInicio: { gte: dataInicio } },
              { dataFim: { lte: dataFim } },
            ],
          },
        ],
      },
    });

    return reservasConflitantes.length === 0;
  }

  async update(id: string, updateVeiculoDto: UpdateVeiculoDto) {
    await this.findOne(id);

    if (updateVeiculoDto.categoriaId) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: updateVeiculoDto.categoriaId },
      });

      if (!categoria) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    return this.prisma.veiculo.update({
      where: { id },
      data: updateVeiculoDto,
      include: { categoria: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Verificar se tem aluguéis ativos
    const aluguelsAtivos = await this.prisma.aluguel.findMany({
      where: {
        veiculoId: id,
        finalizado: false,
      },
    });

    if (aluguelsAtivos.length > 0) {
      throw new BadRequestException('Não é possível remover veículo com aluguéis ativos');
    }

    return this.prisma.veiculo.delete({
      where: { id },
    });
  }
}
