import { TipoVeiculo } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateVeiculoDto {
  @IsString()
  @IsNotEmpty({ message: 'Placa é obrigatória' })
  placa: string;

  @IsString()
  @IsNotEmpty({ message: 'Marca é obrigatória' })
  marca: string;

  @IsString()
  @IsNotEmpty({ message: 'Modelo é obrigatório' })
  modelo: string;

  @IsNumber()
  @Min(1900, { message: 'Ano inválido' })
  ano: number;

  @IsString()
  @IsNotEmpty({ message: 'Cor é obrigatória' })
  cor: string;

  @IsNumber()
  @Min(0, { message: 'Valor da diária deve ser positivo' })
  valorDiaria: number;

  @IsEnum(TipoVeiculo, { message: 'Tipo de veículo inválido' })
  tipo: TipoVeiculo;

  @IsString()
  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  categoriaId: string;

  @ValidateIf((o) => o.tipo === TipoVeiculo.CARRO)
  @IsNumber()
  @IsOptional()
  numeroPortas?: number;

  @ValidateIf((o) => o.tipo === TipoVeiculo.CARRO)
  @IsBoolean()
  @IsOptional()
  possuiArCondicionado?: boolean;

  @ValidateIf((o) => o.tipo === TipoVeiculo.MOTO)
  @IsNumber()
  @IsOptional()
  cilindradas?: number;

  @ValidateIf((o) => o.tipo === TipoVeiculo.MOTO)
  @IsBoolean()
  @IsOptional()
  bau?: boolean;

  @ValidateIf((o) => o.tipo === TipoVeiculo.CAMINHAO)
  @IsNumber()
  @IsOptional()
  capacidadeCarga?: number;
}
