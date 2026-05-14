import { Inject, Injectable } from '@nestjs/common';
import { Funcionario } from '../domain/funcionario.entity';
import { FUNCIONARIO_REPOSITORY, FuncionarioRepository } from '../domain/funcionario.repository';
import { BuscarFuncionarioUseCase } from './buscar-funcionario.use-case';

@Injectable()
export class DesativarFuncionarioUseCase {
  constructor(
    @Inject(FUNCIONARIO_REPOSITORY)
    private readonly funcionarioRepository: FuncionarioRepository,
    private readonly buscarFuncionario: BuscarFuncionarioUseCase,
  ) {}

  async executar(id: string): Promise<Funcionario> {
    await this.buscarFuncionario.garantirExistencia(id);
    return this.funcionarioRepository.desativar(id);
  }
}
