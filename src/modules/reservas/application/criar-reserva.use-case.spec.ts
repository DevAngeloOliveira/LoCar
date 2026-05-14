import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BuscarClienteUseCase } from '../../clientes/application/buscar-cliente.use-case';
import { ValidarFuncionarioAtivoUseCase } from '../../funcionarios/application/validar-funcionario-ativo.use-case';
import { BuscarVeiculoUseCase } from '../../veiculos/application/buscar-veiculo.use-case';
import { VerificarDisponibilidadeUseCase } from '../../veiculos/application/verificar-disponibilidade.use-case';
import { RESERVA_REPOSITORY, ReservaRepository } from '../domain/reserva.repository';
import { CreateReservaDto } from '../presentation/dto/create-reserva.dto';
import { CriarReservaUseCase } from './criar-reserva.use-case';

describe('CriarReservaUseCase', () => {
  let useCase: CriarReservaUseCase;
  let repository: jest.Mocked<ReservaRepository>;
  let buscarCliente: jest.Mocked<Pick<BuscarClienteUseCase, 'executar'>>;
  let validarFuncionarioAtivo: jest.Mocked<Pick<ValidarFuncionarioAtivoUseCase, 'executar'>>;
  let buscarVeiculo: jest.Mocked<Pick<BuscarVeiculoUseCase, 'garantirExistencia'>>;
  let verificarDisponibilidade: jest.Mocked<Pick<VerificarDisponibilidadeUseCase, 'executar'>>;

  const futuro = (dias: number) => {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    return d.toISOString();
  };

  const dtoValido = (): CreateReservaDto => ({
    dataInicio: futuro(1),
    dataFim: futuro(5),
    clienteId: 'cli-1',
    funcionarioId: 'func-1',
    veiculoIds: ['vec-1'],
  });

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<ReservaRepository> = {
      criarComVeiculos: jest.fn(),
      listar: jest.fn(),
      buscarPorIdCompleto: jest.fn(),
      cancelar: jest.fn(),
      existeConflitoDePeriodo: jest.fn(),
    };
    const buscarClienteMock = { executar: jest.fn() };
    const validarFuncionarioAtivoMock = { executar: jest.fn() };
    const buscarVeiculoMock = { garantirExistencia: jest.fn() };
    const verificarDisponibilidadeMock = { executar: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CriarReservaUseCase,
        { provide: RESERVA_REPOSITORY, useValue: repositoryMock },
        { provide: BuscarClienteUseCase, useValue: buscarClienteMock },
        { provide: ValidarFuncionarioAtivoUseCase, useValue: validarFuncionarioAtivoMock },
        { provide: BuscarVeiculoUseCase, useValue: buscarVeiculoMock },
        { provide: VerificarDisponibilidadeUseCase, useValue: verificarDisponibilidadeMock },
      ],
    }).compile();

    useCase = module.get(CriarReservaUseCase);
    repository = module.get(RESERVA_REPOSITORY);
    buscarCliente = module.get(BuscarClienteUseCase);
    validarFuncionarioAtivo = module.get(ValidarFuncionarioAtivoUseCase);
    buscarVeiculo = module.get(BuscarVeiculoUseCase);
    verificarDisponibilidade = module.get(VerificarDisponibilidadeUseCase);
  });

  it('rejeita data de início posterior à data de fim', async () => {
    const dto = { ...dtoValido(), dataInicio: futuro(5), dataFim: futuro(1) };
    await expect(useCase.executar(dto)).rejects.toThrow(BadRequestException);
    expect(repository.criarComVeiculos).not.toHaveBeenCalled();
  });

  it('rejeita data de início no passado', async () => {
    const dto = { ...dtoValido(), dataInicio: futuro(-5), dataFim: futuro(1) };
    await expect(useCase.executar(dto)).rejects.toThrow(BadRequestException);
    expect(repository.criarComVeiculos).not.toHaveBeenCalled();
  });

  it('rejeita reserva quando veículo está indisponível', async () => {
    buscarCliente.executar.mockResolvedValue({} as never);
    validarFuncionarioAtivo.executar.mockResolvedValue();
    verificarDisponibilidade.executar.mockResolvedValue(false);
    buscarVeiculo.garantirExistencia.mockResolvedValue({
      id: 'vec-1',
      modelo: 'Cronos',
    } as never);

    await expect(useCase.executar(dtoValido())).rejects.toThrow(BadRequestException);
    expect(repository.criarComVeiculos).not.toHaveBeenCalled();
  });

  it('persiste reserva quando todas as validações passam', async () => {
    buscarCliente.executar.mockResolvedValue({} as never);
    validarFuncionarioAtivo.executar.mockResolvedValue();
    verificarDisponibilidade.executar.mockResolvedValue(true);
    repository.criarComVeiculos.mockResolvedValue({ id: 'res-1' });

    const resultado = await useCase.executar(dtoValido());

    expect(repository.criarComVeiculos).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual({ id: 'res-1' });
  });
});
