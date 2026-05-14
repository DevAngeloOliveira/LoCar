import { IsString, IsNotEmpty, IsDateString, IsArray, ArrayMinSize } from 'class-validator';

export class CreateReservaDto {
  @IsDateString({}, { message: 'Data de início inválida' })
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  dataInicio: string;

  @IsDateString({}, { message: 'Data de fim inválida' })
  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  dataFim: string;

  @IsString()
  @IsNotEmpty({ message: 'Cliente é obrigatório' })
  clienteId: string;

  @IsString()
  @IsNotEmpty({ message: 'Funcionário é obrigatório' })
  funcionarioId: string;

  @IsArray({ message: 'Veículos devem ser um array' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos um veículo' })
  @IsString({ each: true })
  veiculoIds: string[];
}
