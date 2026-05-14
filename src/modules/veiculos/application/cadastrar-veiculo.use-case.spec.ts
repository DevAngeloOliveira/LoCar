import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TipoVeiculo } from '@prisma/client';
import { BuscarCategoriaUseCase } from '../../categorias/application/buscar-categoria.use-case';
import { VEICULO_REPOSITORY, VeiculoRepository } from '../domain/veiculo.repository';
import { CadastrarVeiculoUseCase } from './cadastrar-veiculo.use-case';

describe('CadastrarVeiculoUseCase', () => {
  let useCase: CadastrarVeiculoUseCase;
  let repository: jest.Mocked<VeiculoRepository>;
  let buscarCategoria: jest.Mocked<Pick<BuscarCategoriaUseCase, 'garantirExistencia'>>;

  const dadosCarro = {
    placa: 'ABC1D23',
    marca: 'Fiat',
    modelo: 'Cronos',
    ano: 2024,
    cor: 'Preto',
    valorDiaria: 120,
    tipo: TipoVeiculo.CARRO,
    categoriaId: 'cat-1',
    numeroPortas: 4,
    possuiArCondicionado: true,
  };

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<VeiculoRepository> = {
      buscarPorId: jest.fn(),
      buscarPorIdCompleto: jest.fn(),
      buscarPorPlaca: jest.fn(),
      listar: jest.fn(),
      criar: jest.fn(),
      atualizar: jest.fn(),
      alterarDisponibilidade: jest.fn(),
      remover: jest.fn(),
      contarAlugueisAtivos: jest.fn(),
      existeConflitoDeReserva: jest.fn(),
    };
    const buscarCategoriaMock = { garantirExistencia: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarVeiculoUseCase,
        { provide: VEICULO_REPOSITORY, useValue: repositoryMock },
        { provide: BuscarCategoriaUseCase, useValue: buscarCategoriaMock },
      ],
    }).compile();

    useCase = module.get(CadastrarVeiculoUseCase);
    repository = module.get(VEICULO_REPOSITORY);
    buscarCategoria = module.get(BuscarCategoriaUseCase);
  });

  it('cria veículo quando placa é inédita e categoria existe', async () => {
    repository.buscarPorPlaca.mockResolvedValue(null);
    buscarCategoria.garantirExistencia.mockResolvedValue({
      id: 'cat-1',
      nome: 'Sedan',
      descricao: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repository.criar.mockResolvedValue({ id: 'novo', ...dadosCarro });

    await useCase.executar(dadosCarro);

    expect(repository.buscarPorPlaca).toHaveBeenCalledWith('ABC1D23');
    expect(buscarCategoria.garantirExistencia).toHaveBeenCalledWith('cat-1');
    expect(repository.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        placa: 'ABC1D23',
        tipo: TipoVeiculo.CARRO,
        numeroPortas: 4,
        possuiArCondicionado: true,
        cilindradas: null,
        bau: null,
        capacidadeCarga: null,
      }),
    );
  });

  it('rejeita placa duplicada com ConflictException', async () => {
    repository.buscarPorPlaca.mockResolvedValue({
      id: 'existente',
      placa: 'ABC1D23',
    } as never);

    await expect(useCase.executar(dadosCarro)).rejects.toThrow(ConflictException);
    expect(buscarCategoria.garantirExistencia).not.toHaveBeenCalled();
    expect(repository.criar).not.toHaveBeenCalled();
  });

  it('rejeita categoria inexistente com NotFoundException', async () => {
    repository.buscarPorPlaca.mockResolvedValue(null);
    buscarCategoria.garantirExistencia.mockRejectedValue(
      new NotFoundException('Categoria não encontrada'),
    );

    await expect(useCase.executar(dadosCarro)).rejects.toThrow(NotFoundException);
    expect(repository.criar).not.toHaveBeenCalled();
  });
});
