import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateLineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  image?: string;

  // Campos extras que você estava enviando e dando erro
  @IsOptional() price?: any;
  @IsOptional() weight?: any;
  @IsOptional() height?: any;
  @IsOptional() width?: any;
  @IsOptional() length?: any;
  @IsOptional() externalColors?: any;
  @IsOptional() internalColors?: any;
  @IsOptional() dynamicOptions?: any;
}
