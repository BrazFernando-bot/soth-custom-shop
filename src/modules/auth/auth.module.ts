import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; // <--- 1. Importe o Strategy

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SOTH_SECRET_ELITE_2024', // Use o .env agora!
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy], // <--- 2. Adicione JwtStrategy aqui nos providers
  controllers: [AuthController],
  exports: [AuthService, JwtModule], // Exporta o JwtModule para outros módulos usarem
})
export class AuthModule {}