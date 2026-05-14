import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateClienteDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
