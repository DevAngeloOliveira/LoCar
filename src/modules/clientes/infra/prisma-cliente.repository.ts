import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { Cliente, ClienteAtualizacao, ClienteCriacao } from '../domain/cliente.entity';
import { ClienteRepository } from '../domain/cliente.repository';

@Injectable()
export class PrismaClienteRepository implements ClienteRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPorId(id: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({ where: { id } });
  }

  buscarPorCpf(cpf: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({ where: { cpf } });
  }

  listarAtivos(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  criar(dados: ClienteCriacao): Promise<Cliente> {
    return this.prisma.cliente.create({ data: dados });
  }

  atualizar(id: string, dados: ClienteAtualizacao): Promise<Cliente> {
    return this.prisma.cliente.update({ where: { id }, data: dados });
  }

  desativar(id: string): Promise<Cliente> {
    return this.prisma.cliente.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
