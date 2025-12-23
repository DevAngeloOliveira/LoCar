import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsEnum, IsOptional, Min, ValidateIf } from 'class-validator';
import { TipoVeiculo } from '@prisma/client';

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

  // Campos específicos para CARRO
  @ValidateIf((o) => o.tipo === TipoVeiculo.CARRO)
  @IsNumber()
  @IsOptional()
  numeroPortas?: number;

  @ValidateIf((o) => o.tipo === TipoVeiculo.CARRO)
  @IsBoolean()
  @IsOptional()
  possuiArCondicionado?: boolean;

  // Campos específicos para MOTO
  @ValidateIf((o) => o.tipo === TipoVeiculo.MOTO)
  @IsNumber()
  @IsOptional()
  cilindradas?: number;

  @ValidateIf((o) => o.tipo === TipoVeiculo.MOTO)
  @IsBoolean()
  @IsOptional()
  bau?: boolean;

  // Campos específicos para CAMINHAO
  @ValidateIf((o) => o.tipo === TipoVeiculo.CAMINHAO)
  @IsNumber()
  @IsOptional()
  capacidadeCarga?: number;
}

export class UpdateVeiculoDto {
  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsNumber()
  @IsOptional()
  ano?: number;

  @IsString()
  @IsOptional()
  cor?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valorDiaria?: number;

  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @IsString()
  @IsOptional()
  categoriaId?: string;

  @IsNumber()
  @IsOptional()
  numeroPortas?: number;

  @IsBoolean()
  @IsOptional()
  possuiArCondicionado?: boolean;

  @IsNumber()
  @IsOptional()
  cilindradas?: number;

  @IsBoolean()
  @IsOptional()
  bau?: boolean;

  @IsNumber()
  @IsOptional()
  capacidadeCarga?: number;
}
