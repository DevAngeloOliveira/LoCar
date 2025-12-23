import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuncionarioDto, UpdateFuncionarioDto } from './dto/funcionario.dto';

@Injectable()
export class FuncionariosService {
  constructor(private prisma: PrismaService) {}

  /**
   * RF-BE-04: Cadastrar funcionário
   * RF-BE-05: Valida unicidade da matrícula
   */
  async create(createFuncionarioDto: CreateFuncionarioDto) {
    const funcionarioExistente = await this.prisma.funcionario.findUnique({
      where: { matricula: createFuncionarioDto.matricula },
    });

    if (funcionarioExistente) {
      throw new ConflictException('Matrícula já cadastrada no sistema');
    }

    return this.prisma.funcionario.create({
      data: createFuncionarioDto,
    });
  }

  async findAll() {
    return this.prisma.funcionario.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id },
      include: {
        reservas: true,
      },
    });

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return funcionario;
  }

  /**
   * RF-BE-06: Validar se funcionário está ativo
   */
  async validateFuncionarioAtivo(id: string): Promise<void> {
    const funcionario = await this.findOne(id);
    
    if (!funcionario.ativo) {
      throw new BadRequestException('Funcionário inativo não pode realizar operações');
    }
  }

  async update(id: string, updateFuncionarioDto: UpdateFuncionarioDto) {
    await this.findOne(id);

    return this.prisma.funcionario.update({
      where: { id },
      data: updateFuncionarioDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.funcionario.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
