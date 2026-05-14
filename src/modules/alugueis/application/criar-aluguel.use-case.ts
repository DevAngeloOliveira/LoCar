import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ValidarReservaParaAluguelUseCase } from '../../reservas/application/validar-reserva-para-aluguel.use-case';
import { BuscarVeiculoUseCase } from '../../veiculos/application/buscar-veiculo.use-case';
import {
  ALUGUEL_REPOSITORY,
  AluguelRepository,
} from '../domain/aluguel.repository';
import { CreateAluguelDto } from '../presentation/dto/create-aluguel.dto';

const MS_POR_DIA = 1000 * 60 * 60 * 24;

@Injectable()
export class CriarAluguelUseCase {
  constructor(
    @Inject(ALUGUEL_REPOSITORY)
    private readonly aluguelRepository: AluguelRepository,
    private readonly validarReservaParaAluguel: ValidarReservaParaAluguelUseCase,
    private readonly buscarVeiculo: BuscarVeiculoUseCase,
  ) {}

  async executar(dto: CreateAluguelDto) {
    const reserva = await this.validarReservaParaAluguel.executar(
      dto.reservaId,
    );

    const veiculoNaReserva = reserva.veiculos.find(
      (rv) => rv.veiculoId === dto.veiculoId,
    );
    if (!veiculoNaReserva) {
      throw new BadRequestException('Veículo não está incluído nesta reserva');
    }

    const veiculo = await this.buscarVeiculo.garantirExistencia(dto.veiculoId);

    const inicio = dto.dataInicio ? new Date(dto.dataInicio) : reserva.dataInicio;
    const diasAluguel = Math.ceil(
      (reserva.dataFim.getTime() - reserva.dataInicio.getTime()) / MS_POR_DIA,
    );
    const valorTotal = diasAluguel * veiculo.valorDiaria;

    return this.aluguelRepository.criarComBloqueioDeVeiculo({
      reservaId: dto.reservaId,
      clienteId: reserva.clienteId,
      veiculoId: dto.veiculoId,
      dataInicio: inicio,
      valorTotal,
    });
  }
}
