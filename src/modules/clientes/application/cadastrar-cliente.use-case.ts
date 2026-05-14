import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Cliente } from '../domain/cliente.entity';
import { CLIENTE_REPOSITORY, ClienteRepository } from '../domain/cliente.repository';
import { CreateClienteDto } from '../presentation/dto/create-cliente.dto';

@Injectable()
export class CadastrarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async executar(dados: CreateClienteDto): Promise<Cliente> {
    const existente = await this.clienteRepository.buscarPorCpf(dados.cpf);
    if (existente) {
      throw new ConflictException('CPF já cadastrado no sistema');
    }

    return this.clienteRepository.criar({
      nome: dados.nome,
      cpf: dados.cpf,
      endereco: dados.endereco,
      telefone: dados.telefone,
      email: dados.email,
      ativo: true,
    });
  }
}
