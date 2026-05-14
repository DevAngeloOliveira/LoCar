import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateAluguelDto {
  @IsString()
  @IsNotEmpty({ message: 'Reserva é obrigatória' })
  reservaId: string;

  @IsString()
  @IsNotEmpty({ message: 'Veículo é obrigatório' })
  veiculoId: string;

  @IsDateString({}, { message: 'Data de início inválida' })
  @IsOptional()
  dataInicio?: string;
}

export class FinalizarAluguelDto {
  @IsDateString({}, { message: 'Data de fim inválida' })
  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  dataFim: string;
}
