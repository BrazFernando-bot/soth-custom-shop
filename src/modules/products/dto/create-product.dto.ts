import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer'; // <--- Importação necessária

export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() subtitle?: string;
  @IsString() @IsOptional() description?: string;
  
  @Type(() => Number) // Força a conversão de "1200" (string) para 1200 (number)
  @IsNumber() @IsNotEmpty() price: number;
  
  @IsString() @IsNotEmpty() category: string;
  
  @IsOptional() @IsArray() images?: string[];

  // Campos que o formulário está enviando
  @IsOptional() @IsString() lineId?: string;
  @IsOptional() @IsBoolean() requiresMeasurements?: boolean;
  @IsOptional() @IsString() externalColors?: string;
  @IsOptional() @IsString() internalColors?: string;
  @IsOptional() @IsString() dynamicOptions?: string;

  @Type(() => Number) @IsOptional() @IsNumber() weight?: number;
  @Type(() => Number) @IsOptional() @IsNumber() height?: number;
  @Type(() => Number) @IsOptional() @IsNumber() width?: number;
  @Type(() => Number) @IsOptional() @IsNumber() length?: number;
}
