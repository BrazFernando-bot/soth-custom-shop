import { Controller, Post, Body } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CalculateShippingDto } from './dto/calculate-shipping.dto';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  async calculate(@Body() data: CalculateShippingDto) {
    return this.shippingService.calculate(data);
  }
}