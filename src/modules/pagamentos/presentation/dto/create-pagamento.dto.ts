import { TipoPagamento } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreatePagamentoDto {
  @IsEnum(TipoPagamento, { message: 'Tipo de pagamento inválido' })
  @IsNotEmpty({ message: 'Tipo de pagamento é obrigatório' })
  tipo: TipoPagamento;

  @IsNumber()
  @Min(0, { message: 'Valor deve ser positivo' })
  valor: number;

  @IsString()
  @IsNotEmpty({ message: 'Aluguel é obrigatório' })
  aluguelId: string;
}
