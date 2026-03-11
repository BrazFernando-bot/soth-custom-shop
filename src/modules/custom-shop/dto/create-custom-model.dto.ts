import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateCustomModelDto {
  @IsString()
  @IsNotEmpty()
  lineId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsOptional()
  requiresMeasurements?: boolean;

  // --- MUDANÇA AQUI: Alinhando com os campos de Cores e Opções do Admin ---
  @IsOptional()
  dynamicOptions?: any;

  @IsArray()
  @IsOptional()
  externalColors?: string[];

  @IsArray()
  @IsOptional()
  internalColors?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  // --- MEDIDAS LOGÍSTICAS ---
  @IsOptional() weight?: number;
  @IsOptional() height?: number;
  @IsOptional() width?: number;
  @IsOptional() length?: number;
}