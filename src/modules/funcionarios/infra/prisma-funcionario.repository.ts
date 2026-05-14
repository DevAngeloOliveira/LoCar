import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import {
  Funcionario,
  FuncionarioAtualizacao,
  FuncionarioCriacao,
} from '../domain/funcionario.entity';
import { FuncionarioRepository } from '../domain/funcionario.repository';

@Injectable()
export class PrismaFuncionarioRepository implements FuncionarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPorId(id: string): Promise<Funcionario | null> {
    return this.prisma.funcionario.findUnique({ where: { id } });
  }

  buscarPorIdComReservas(id: string) {
    return this.prisma.funcionario.findUnique({
      where: { id },
      include: { reservas: true },
    });
  }

  buscarPorMatricula(matricula: string): Promise<Funcionario | null> {
    return this.prisma.funcionario.findUnique({ where: { matricula } });
  }

  listarAtivos(): Promise<Funcionario[]> {
    return this.prisma.funcionario.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  criar(dados: FuncionarioCriacao): Promise<Funcionario> {
    return this.prisma.funcionario.create({ data: dados });
  }

  atualizar(id: string, dados: FuncionarioAtualizacao): Promise<Funcionario> {
    return this.prisma.funcionario.update({ where: { id }, data: dados });
  }

  desativar(id: string): Promise<Funcionario> {
    return this.prisma.funcionario.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
