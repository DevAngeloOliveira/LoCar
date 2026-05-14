import { Inject, Injectable } from '@nestjs/common';
import { Cliente } from '../domain/cliente.entity';
import { CLIENTE_REPOSITORY, ClienteRepository } from '../domain/cliente.repository';
import { UpdateClienteDto } from '../presentation/dto/update-cliente.dto';
import { BuscarClienteUseCase } from './buscar-cliente.use-case';

@Injectable()
export class AtualizarClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
    private readonly buscarCliente: BuscarClienteUseCase,
  ) {}

  async executar(id: string, dados: UpdateClienteDto): Promise<Cliente> {
    await this.buscarCliente.executar(id);
    return this.clienteRepository.atualizar(id, dados);
  }
}
