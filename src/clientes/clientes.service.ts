import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  /**
   * RF-BE-01: Cadastrar cliente
   * RN: Valida unicidade do CPF
   */
  async create(createClienteDto: CreateClienteDto) {
    const clienteExistente = await this.prisma.cliente.findUnique({
      where: { cpf: createClienteDto.cpf },
    });

    if (clienteExistente) {
      throw new ConflictException('CPF já cadastrado no sistema');
    }

    return this.prisma.cliente.create({
      data: createClienteDto,
    });
  }

  /**
   * RF-BE-03: Consultar todos os clientes
   */
  async findAll() {
    return this.prisma.cliente.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * RF-BE-03: Consultar cliente por ID
   */
  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        reservas: true,
        alugueis: true,
      },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  /**
   * RF-BE-03: Atualizar cliente
   */
  async update(id: string, updateClienteDto: UpdateClienteDto) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.cliente.update({
      where: { id },
      data: updateClienteDto,
    });
  }

  /**
   * RF-BE-03: Desativar cliente (soft delete)
   */
  async remove(id: string) {
    await this.findOne(id); // Verifica se existe

    return this.prisma.cliente.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
