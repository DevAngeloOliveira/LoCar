import { Inject, Injectable } from '@nestjs/common';
import { Cliente } from '../domain/cliente.entity';
import { CLIENTE_REPOSITORY, ClienteRepository } from '../domain/cliente.repository';
import { BuscarClienteUseCase } from './buscar-cliente.use-case';

@Injectable()
export class DesativarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
    private readonly buscarCliente: BuscarClienteUseCase,
  ) {}

  async executar(id: string): Promise<Cliente> {
    await this.buscarCliente.executar(id);
    return this.clienteRepository.desativar(id);
  }
}
