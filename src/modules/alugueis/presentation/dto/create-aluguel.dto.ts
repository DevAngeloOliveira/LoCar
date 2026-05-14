import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
