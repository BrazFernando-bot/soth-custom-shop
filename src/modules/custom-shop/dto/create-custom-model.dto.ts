import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomModelDto {
  @IsString() @IsNotEmpty() lineId: string;
  @IsString() @IsNotEmpty() name: string;
  
  @IsString() @IsOptional() subtitle?: string;
  @IsString() @IsOptional() description?: string;
  
  @Type(() => Number)
  @IsNumber() @IsNotEmpty() price: number;

  @IsBoolean() @IsOptional() requiresMeasurements?: boolean;

  // AQUI É O PONTO CHAVE: dynamicOptions é um array de objetos
  @IsOptional() @IsArray() dynamicOptions?: any[]; 

  @IsOptional() @IsArray() externalColors?: string[];
  @IsOptional() @IsArray() internalColors?: string[];

  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() image?: string;

  @Type(() => Number) @IsOptional() @IsNumber() weight?: number;
  @Type(() => Number) @IsOptional() @IsNumber() height?: number;
  @Type(() => Number) @IsOptional() @IsNumber() width?: number;
  @Type(() => Number) @IsOptional() @IsNumber() length?: number;
}
