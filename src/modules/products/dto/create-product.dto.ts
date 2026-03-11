import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() subtitle?: string;
  @IsString() @IsOptional() description?: string;
  @IsNumber() @IsNotEmpty() price: number;
  @IsString() @IsNotEmpty() category: string;
  
  @IsArray() @IsString({ each: true }) images: string[];

  // Tornamos opcionais e o Service dará o valor padrão se não vier nada
  @IsOptional() @IsNumber() weight?: number;
  @IsOptional() @IsNumber() height?: number;
  @IsOptional() @IsNumber() width?: number;
  @IsOptional() @IsNumber() length?: number;
}