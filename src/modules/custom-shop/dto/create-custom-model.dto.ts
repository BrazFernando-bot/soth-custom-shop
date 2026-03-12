import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateCustomModelDto {
  @IsString() @IsNotEmpty() lineId: string;
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() subtitle?: string;
  @IsString() @IsOptional() description?: string;
  
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsBoolean() requiresMeasurements?: boolean;

  @IsOptional() dynamicOptions?: any;
  @IsOptional() externalColors?: any;
  @IsOptional() internalColors?: any;

  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() image?: string;

  // Medidas
  @IsOptional() @IsNumber() weight?: number;
  @IsOptional() @IsNumber() height?: number;
  @IsOptional() @IsNumber() width?: number;
  @IsOptional() @IsNumber() length?: number;
}
