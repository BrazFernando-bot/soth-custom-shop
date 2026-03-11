import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateLineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  // CORREÇÃO: Aceita agora todas as variações para evitar o erro 400
  @IsIn(['BAG', 'CASE', 'BAGS', 'CASES']) 
  type: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string; 
  
  // Campo 'img' como opcional para evitar erro caso o front envie um ou outro
  @IsString()
  @IsOptional()
  img?: string;
}