import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateLineDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() subtitle?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() type?: string; // Tornamos opcional para não travar
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsString() img?: string;
  @IsOptional() @IsArray() colors?: string[];
}
