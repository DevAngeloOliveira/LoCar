import { Inject, Injectable } from '@nestjs/common';
import { Funcionario } from '../domain/funcionario.entity';
import {
  FUNCIONARIO_REPOSITORY,
  FuncionarioRepository,
} from '../domain/funcionario.repository';
import { UpdateFuncionarioDto } from '../presentation/dto/update-funcionario.dto';
import { BuscarFuncionarioUseCase } from './buscar-funcionario.use-case';

@Injectable()
export class AtualizarFuncionarioUseCase {
  constructor(
    @Inject(FUNCIONARIO_REPOSITORY)
    private readonly funcionarioRepository: FuncionarioRepository,
    private readonly buscarFuncionario: BuscarFuncionarioUseCase,
  ) {}

  async executar(
    id: string,
    dados: UpdateFuncionarioDto,
  ): Promise<Funcionario> {
    await this.buscarFuncionario.garantirExistencia(id);
    return this.funcionarioRepository.atualizar(id, dados);
  }
}
