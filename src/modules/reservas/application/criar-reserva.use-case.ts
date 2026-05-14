import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BuscarClienteUseCase } from '../../clientes/application/buscar-cliente.use-case';
import { ValidarFuncionarioAtivoUseCase } from '../../funcionarios/application/validar-funcionario-ativo.use-case';
import { BuscarVeiculoUseCase } from '../../veiculos/application/buscar-veiculo.use-case';
import { VerificarDisponibilidadeUseCase } from '../../veiculos/application/verificar-disponibilidade.use-case';
import {
  RESERVA_REPOSITORY,
  ReservaRepository,
} from '../domain/reserva.repository';
import { CreateReservaDto } from '../presentation/dto/create-reserva.dto';

@Injectable()
export class CriarReservaUseCase {
  constructor(
    @Inject(RESERVA_REPOSITORY)
    private readonly reservaRepository: ReservaRepository,
    private readonly buscarCliente: BuscarClienteUseCase,
    private readonly validarFuncionarioAtivo: ValidarFuncionarioAtivoUseCase,
    private readonly buscarVeiculo: BuscarVeiculoUseCase,
    private readonly verificarDisponibilidade: VerificarDisponibilidadeUseCase,
  ) {}

  async executar(dto: CreateReservaDto) {
    const inicio = new Date(dto.dataInicio);
    const fim = new Date(dto.dataFim);

    if (inicio >= fim) {
      throw new BadRequestException(
        'Data de início deve ser anterior à data de fim',
      );
    }

    if (inicio < new Date()) {
      throw new BadRequestException('Data de início não pode ser no passado');
    }

    await this.buscarCliente.executar(dto.clienteId);
    await this.validarFuncionarioAtivo.executar(dto.funcionarioId);

    for (const veiculoId of dto.veiculoIds) {
      const disponivel = await this.verificarDisponibilidade.executar(
        veiculoId,
        inicio,
        fim,
      );
      if (!disponivel) {
        const veiculo = await this.buscarVeiculo.garantirExistencia(veiculoId);
        throw new BadRequestException(
          `Veículo ${veiculo.modelo} não disponível para o período selecionado`,
        );
      }
    }

    return this.reservaRepository.criarComVeiculos({
      dataInicio: inicio,
      dataFim: fim,
      clienteId: dto.clienteId,
      funcionarioId: dto.funcionarioId,
      veiculoIds: dto.veiculoIds,
    });
  }
}
