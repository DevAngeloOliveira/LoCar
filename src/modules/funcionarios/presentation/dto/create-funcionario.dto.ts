import { IsNotEmpty, IsString } from 'class-validator';

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
