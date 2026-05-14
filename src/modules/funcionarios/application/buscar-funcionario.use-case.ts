import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Funcionario } from '../domain/funcionario.entity';
import { FUNCIONARIO_REPOSITORY, FuncionarioRepository } from '../domain/funcionario.repository';

@Injectable()
export class BuscarFuncionarioUseCase {
  constructor(
    @Inject(FUNCIONARIO_REPOSITORY)
    private readonly funcionarioRepository: FuncionarioRepository,
  ) {}

  async executar(id: string): Promise<unknown> {
    const funcionario = await this.funcionarioRepository.buscarPorIdComReservas(id);
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    return funcionario;
  }

  async garantirExistencia(id: string): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.buscarPorId(id);
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    return funcionario;
  }
}
