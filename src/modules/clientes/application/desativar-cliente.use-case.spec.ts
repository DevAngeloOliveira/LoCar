import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CLIENTE_REPOSITORY, ClienteRepository } from '../domain/cliente.repository';
import { BuscarClienteUseCase } from './buscar-cliente.use-case';
import { DesativarClienteUseCase } from './desativar-cliente.use-case';

describe('DesativarClienteUseCase', () => {
  let useCase: DesativarClienteUseCase;
  let repository: jest.Mocked<ClienteRepository>;

  const clienteAtivo = {
    id: 'abc',
    nome: 'João',
    cpf: '12345678900',
    endereco: 'Rua A',
    telefone: '11999999999',
    email: 'joao@email.com',
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<ClienteRepository> = {
      buscarPorId: jest.fn(),
      buscarPorCpf: jest.fn(),
      listarAtivos: jest.fn(),
      criar: jest.fn(),
      atualizar: jest.fn(),
      desativar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DesativarClienteUseCase,
        BuscarClienteUseCase,
        { provide: CLIENTE_REPOSITORY, useValue: repositoryMock },
      ],
    }).compile();

    useCase = module.get(DesativarClienteUseCase);
    repository = module.get(CLIENTE_REPOSITORY);
  });

  it('aplica soft delete quando cliente existe', async () => {
    repository.buscarPorId.mockResolvedValue(clienteAtivo);
    repository.desativar.mockResolvedValue({ ...clienteAtivo, ativo: false });

    const resultado = await useCase.executar('abc');

    expect(repository.desativar).toHaveBeenCalledWith('abc');
    expect(resultado.ativo).toBe(false);
  });

  it('lança NotFoundException quando cliente não existe', async () => {
    repository.buscarPorId.mockResolvedValue(null);

    await expect(useCase.executar('inexistente')).rejects.toThrow(NotFoundException);
    expect(repository.desativar).not.toHaveBeenCalled();
  });
});
