import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Funcionario } from '../domain/funcionario.entity';
import { FUNCIONARIO_REPOSITORY, FuncionarioRepository } from '../domain/funcionario.repository';
import { CreateFuncionarioDto } from '../presentation/dto/create-funcionario.dto';

@Injectable()
export class CadastrarFuncionarioUseCase {
  constructor(
    @Inject(FUNCIONARIO_REPOSITORY)
    private readonly funcionarioRepository: FuncionarioRepository,
  ) {}

  async executar(dados: CreateFuncionarioDto): Promise<Funcionario> {
    const existente = await this.funcionarioRepository.buscarPorMatricula(dados.matricula);
    if (existente) {
      throw new ConflictException('Matrícula já cadastrada no sistema');
    }

    return this.funcionarioRepository.criar({
      ...dados,
      ativo: true,
    });
  }
}
