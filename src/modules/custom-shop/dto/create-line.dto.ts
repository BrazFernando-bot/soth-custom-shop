export class CreateLineDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() type?: string; 
  
  // Adicione estes campos como opcionais para o ValidationPipe não barrar
  @IsOptional() price?: any;
  @IsOptional() weight?: any;
  @IsOptional() height?: any;
  @IsOptional() width?: any;
  @IsOptional() length?: any;
  @IsOptional() externalColors?: any;
  @IsOptional() internalColors?: any;
  @IsOptional() dynamicOptions?: any;
  @IsOptional() images?: any;
}
