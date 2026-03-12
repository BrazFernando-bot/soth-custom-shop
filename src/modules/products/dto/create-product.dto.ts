import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() subtitle?: string;
  @IsString() @IsOptional() description?: string;
  @IsNumber() @IsOptional() price: number; // Mudei para Optional caso você envie como string no form
  @IsString() @IsNotEmpty() category: string;
  
  @IsOptional() @IsArray() images?: string[];

  // Campos que o formulário está enviando e o Backend estava bloqueando:
  @IsOptional() @IsString() lineId?: string;
  @IsOptional() @IsBoolean() requiresMeasurements?: boolean;
  @IsOptional() @IsString() externalColors?: string;
  @IsOptional() @IsString() internalColors?: string;
  @IsOptional() @IsString() dynamicOptions?: string;

  @IsOptional() @IsNumber() weight?: number;
  @IsOptional() @IsNumber() height?: number;
  @IsOptional() @IsNumber() width?: number;
  @IsOptional() @IsNumber() length?: number;
}
