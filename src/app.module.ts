import { Module, Global } from '@nestjs/common';
import { PrismaService } from './shared/database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CustomShopModule } from './modules/custom-shop/custom-shop.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { StorageModule } from './shared/storage/storage.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './shared/mail/mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.maileroo.com',
        port: 587,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"SOTH Custom Shop" <${process.env.MAIL_FROM}>`,
      },
    }),
    AuthModule, 
    UsersModule, 
    ProductsModule, 
    CustomShopModule,
    OrdersModule,
    PaymentsModule,
    StorageModule,
    ShippingModule,
  ],
  providers: [PrismaService, MailService],
  exports: [PrismaService, MailService],
})
export class AppModule {}