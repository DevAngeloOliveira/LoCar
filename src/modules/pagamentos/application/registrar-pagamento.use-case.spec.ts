import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TipoPagamento } from '@prisma/client';
import { BuscarAluguelUseCase } from '../../alugueis/application/buscar-aluguel.use-case';
import { AluguelComRelacoes } from '../../alugueis/domain/aluguel.entity';
import { PAGAMENTO_REPOSITORY, PagamentoRepository } from '../domain/pagamento.repository';
import { RegistrarPagamentoUseCase } from './registrar-pagamento.use-case';

describe('RegistrarPagamentoUseCase', () => {
  let useCase: RegistrarPagamentoUseCase;
  let repository: jest.Mocked<PagamentoRepository>;
  let buscarAluguel: jest.Mocked<Pick<BuscarAluguelUseCase, 'executar'>>;

  const aluguelSemPagamento: AluguelComRelacoes = {
    id: 'al-1',
    dataInicio: new Date(),
    dataFim: null,
    valorTotal: 500,
    finalizado: false,
    reservaId: 'res-1',
    clienteId: 'cli-1',
    veiculoId: 'vec-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    cliente: {},
    veiculo: {},
    reserva: {},
    pagamento: null,
  };

  const dto = {
    tipo: TipoPagamento.PIX,
    valor: 500,
    aluguelId: 'al-1',
  };

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<PagamentoRepository> = {
      buscarPorIdCompleto: jest.fn(),
      buscarPorAluguel: jest.fn(),
      listar: jest.fn(),
      criar: jest.fn(),
    };
    const buscarAluguelMock = { executar: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrarPagamentoUseCase,
        { provide: PAGAMENTO_REPOSITORY, useValue: repositoryMock },
        { provide: BuscarAluguelUseCase, useValue: buscarAluguelMock },
      ],
    }).compile();

    useCase = module.get(RegistrarPagamentoUseCase);
    repository = module.get(PAGAMENTO_REPOSITORY);
    buscarAluguel = module.get(BuscarAluguelUseCase);
  });

  it('registra pagamento quando aluguel ainda não foi pago', async () => {
    buscarAluguel.executar.mockResolvedValue(aluguelSemPagamento);
    repository.criar.mockResolvedValue({ id: 'pag-1' });

    await useCase.executar(dto);

    expect(repository.criar).toHaveBeenCalledWith({
      tipo: TipoPagamento.PIX,
      valor: 500,
      aluguelId: 'al-1',
    });
  });

  it('rejeita pagamento duplicado para o mesmo aluguel', async () => {
    buscarAluguel.executar.mockResolvedValue({
      ...aluguelSemPagamento,
      pagamento: { id: 'pag-existente' },
    });

    await expect(useCase.executar(dto)).rejects.toThrow(ConflictException);
    expect(repository.criar).not.toHaveBeenCalled();
  });

  it('rejeita pagamento para aluguel finalizado', async () => {
    buscarAluguel.executar.mockResolvedValue({
      ...aluguelSemPagamento,
      finalizado: true,
    });

    await expect(useCase.executar(dto)).rejects.toThrow(BadRequestException);
    expect(repository.criar).not.toHaveBeenCalled();
  });

  it('rejeita pagamento com valor inferior ao total', async () => {
    buscarAluguel.executar.mockResolvedValue(aluguelSemPagamento);

    await expect(
      useCase.executar({ ...dto, valor: 100 }),
    ).rejects.toThrow(BadRequestException);
    expect(repository.criar).not.toHaveBeenCalled();
  });
});
