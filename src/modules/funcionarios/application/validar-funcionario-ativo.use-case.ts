import { BadRequestException, Injectable } from '@nestjs/common';
import { BuscarFuncionarioUseCase } from './buscar-funcionario.use-case';

@Injectable()
export class ValidarFuncionarioAtivoUseCase {
  constructor(
    private readonly buscarFuncionario: BuscarFuncionarioUseCase,
  ) {}

  async executar(id: string): Promise<void> {
    const funcionario = await this.buscarFuncionario.garantirExistencia(id);
    if (!funcionario.ativo) {
      throw new BadRequestException(
        'Funcionário inativo não pode realizar operações',
      );
    }
  }
}
