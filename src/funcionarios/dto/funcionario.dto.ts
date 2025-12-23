import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsBoolean } from 'class-validator';

export class CreateFuncionarioDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'Matrícula é obrigatória' })
  matricula: string;

  @IsString()
  @IsNotEmpty({ message: 'Cargo é obrigatório' })
  cargo: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  telefone: string;
}

export class UpdateFuncionarioDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  cargo?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
