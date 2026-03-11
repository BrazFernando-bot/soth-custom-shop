import { Module } from '@nestjs/common';
import { CustomShopService } from './custom-shop.service';
import { CustomShopController } from './custom-shop.controller';

@Module({
  providers: [CustomShopService],
  controllers: [CustomShopController],
})
export class CustomShopModule {}