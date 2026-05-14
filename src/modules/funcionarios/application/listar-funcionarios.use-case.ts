import { Inject, Injectable } from '@nestjs/common';
import { Funcionario } from '../domain/funcionario.entity';
import {
  FUNCIONARIO_REPOSITORY,
  FuncionarioRepository,
} from '../domain/funcionario.repository';

@Injectable()
export class ListarFuncionariosUseCase {
  constructor(
    @Inject(FUNCIONARIO_REPOSITORY)
    private readonly funcionarioRepository: FuncionarioRepository,
  ) {}

  executar(): Promise<Funcionario[]> {
    return this.funcionarioRepository.listarAtivos();
  }
}
