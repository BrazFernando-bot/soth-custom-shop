import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class CalculateShippingDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 9)
  zipCode: string;

  @IsArray()
  @IsNotEmpty()
  items: any[]; // Aceita a lista de produtos do carrinho
}