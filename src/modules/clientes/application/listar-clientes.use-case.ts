import { Inject, Injectable } from '@nestjs/common';
import { Cliente } from '../domain/cliente.entity';
import { CLIENTE_REPOSITORY, ClienteRepository } from '../domain/cliente.repository';

@Injectable()
export class ListarClientesUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
  ) {}

  executar(): Promise<Cliente[]> {
    return this.clienteRepository.listarAtivos();
  }
}
