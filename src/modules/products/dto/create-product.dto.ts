import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() subtitle?: string;
  @IsString() @IsOptional() description?: string;
  
  @Type(() => Number)
  @IsNumber() @IsNotEmpty() price: number;
  
  @IsString() @IsNotEmpty() category: string;
  
  // Imagens
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() image?: string;

  // Logística e Customização
  @IsOptional() @IsString() lineId?: string;
  @IsOptional() @IsBoolean() requiresMeasurements?: boolean;
  @IsOptional() @IsString() externalColors?: string;
  @IsOptional() @IsString() internalColors?: string;
  @IsOptional() @IsArray() dynamicOptions?: any[];

  // Dimensões
  @Type(() => Number) @IsOptional() @IsNumber() weight?: number;
  @Type(() => Number) @IsOptional() @IsNumber() height?: number;
  @Type(() => Number) @IsOptional() @IsNumber() width?: number;
  @Type(() => Number) @IsOptional() @IsNumber() length?: number;
}
