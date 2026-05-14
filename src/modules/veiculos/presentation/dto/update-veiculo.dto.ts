import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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
