import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { Categoria, CategoriaComContagem, CategoriaCriacao } from '../domain/categoria.entity';
import { CategoriaRepository } from '../domain/categoria.repository';

@Injectable()
export class PrismaCategoriaRepository implements CategoriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  buscarPorId(id: string): Promise<Categoria | null> {
    return this.prisma.categoria.findUnique({ where: { id } });
  }

  buscarPorIdComVeiculos(id: string) {
    return this.prisma.categoria.findUnique({
      where: { id },
      include: { veiculos: true },
    });
  }

  buscarPorNome(nome: string): Promise<Categoria | null> {
    return this.prisma.categoria.findUnique({ where: { nome } });
  }

  listarComContagem(): Promise<CategoriaComContagem[]> {
    return this.prisma.categoria.findMany({
      include: { _count: { select: { veiculos: true } } },
      orderBy: { nome: 'asc' },
    }) as Promise<CategoriaComContagem[]>;
  }

  criar(dados: CategoriaCriacao): Promise<Categoria> {
    return this.prisma.categoria.create({ data: dados });
  }
}
