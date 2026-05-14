import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CLIENTE_REPOSITORY, ClienteRepository } from '../domain/cliente.repository';
import { CadastrarClienteUseCase } from './cadastrar-cliente.use-case';

describe('CadastrarClienteUseCase', () => {
  let useCase: CadastrarClienteUseCase;
  let repository: jest.Mocked<ClienteRepository>;

  const dadosValidos = {
    nome: 'João Silva',
    cpf: '12345678900',
    endereco: 'Rua Teste, 123',
    telefone: '11987654321',
    email: 'joao@email.com',
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
        CadastrarClienteUseCase,
        { provide: CLIENTE_REPOSITORY, useValue: repositoryMock },
      ],
    }).compile();

    useCase = module.get(CadastrarClienteUseCase);
    repository = module.get(CLIENTE_REPOSITORY);
  });

  it('cria cliente quando CPF é inédito e marca como ativo', async () => {
    repository.buscarPorCpf.mockResolvedValue(null);
    repository.criar.mockImplementation(async (dados) => ({
      ...dados,
      id: 'gerado',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const resultado = await useCase.executar(dadosValidos);

    expect(repository.buscarPorCpf).toHaveBeenCalledWith('12345678900');
    expect(repository.criar).toHaveBeenCalledWith({
      ...dadosValidos,
      ativo: true,
    });
    expect(resultado.ativo).toBe(true);
  });

  it('lança ConflictException quando CPF já existe', async () => {
    repository.buscarPorCpf.mockResolvedValue({
      id: 'existente',
      ...dadosValidos,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(useCase.executar(dadosValidos)).rejects.toThrow(ConflictException);
    expect(repository.criar).not.toHaveBeenCalled();
  });
});
