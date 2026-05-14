import { IsDateString, IsNotEmpty } from 'class-validator';

export class FinalizarAluguelDto {
  @IsDateString({}, { message: 'Data de fim inválida' })
  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  dataFim: string;
}
