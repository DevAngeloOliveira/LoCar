import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AluguelComRelacoes } from '../domain/aluguel.entity';
import { ALUGUEL_REPOSITORY, AluguelRepository } from '../domain/aluguel.repository';
import { BuscarAluguelUseCase } from './buscar-aluguel.use-case';
import { FinalizarAluguelUseCase } from './finalizar-aluguel.use-case';

describe('FinalizarAluguelUseCase', () => {
  let useCase: FinalizarAluguelUseCase;
  let repository: jest.Mocked<AluguelRepository>;
  let buscarAluguel: jest.Mocked<Pick<BuscarAluguelUseCase, 'executar'>>;

  const baseAluguel: AluguelComRelacoes = {
    id: 'al-1',
    dataInicio: new Date('2026-01-01'),
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
    pagamento: { id: 'pag-1' },
  };

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<AluguelRepository> = {
      buscarPorIdCompleto: jest.fn(),
      listar: jest.fn(),
      criarComBloqueioDeVeiculo: jest.fn(),
      finalizarComLiberacaoDeVeiculo: jest.fn(),
    };
    const buscarAluguelMock = { executar: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinalizarAluguelUseCase,
        { provide: ALUGUEL_REPOSITORY, useValue: repositoryMock },
        { provide: BuscarAluguelUseCase, useValue: buscarAluguelMock },
      ],
    }).compile();

    useCase = module.get(FinalizarAluguelUseCase);
    repository = module.get(ALUGUEL_REPOSITORY);
    buscarAluguel = module.get(BuscarAluguelUseCase);
  });

  it('finaliza aluguel quando pagamento existe e data é válida', async () => {
    buscarAluguel.executar.mockResolvedValue(baseAluguel);
    repository.finalizarComLiberacaoDeVeiculo.mockResolvedValue({});

    await useCase.executar('al-1', { dataFim: '2026-01-10' });

    expect(repository.finalizarComLiberacaoDeVeiculo).toHaveBeenCalledWith(
      'al-1',
      new Date('2026-01-10'),
      'vec-1',
    );
  });

  it('rejeita finalização de aluguel já finalizado', async () => {
    buscarAluguel.executar.mockResolvedValue({ ...baseAluguel, finalizado: true });

    await expect(useCase.executar('al-1', { dataFim: '2026-01-10' })).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.finalizarComLiberacaoDeVeiculo).not.toHaveBeenCalled();
  });

  it('rejeita finalização sem pagamento (RN02)', async () => {
    buscarAluguel.executar.mockResolvedValue({ ...baseAluguel, pagamento: null });

    await expect(useCase.executar('al-1', { dataFim: '2026-01-10' })).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.finalizarComLiberacaoDeVeiculo).not.toHaveBeenCalled();
  });

  it('rejeita data de fim anterior à data de início', async () => {
    buscarAluguel.executar.mockResolvedValue(baseAluguel);

    await expect(useCase.executar('al-1', { dataFim: '2025-12-15' })).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.finalizarComLiberacaoDeVeiculo).not.toHaveBeenCalled();
  });
});
