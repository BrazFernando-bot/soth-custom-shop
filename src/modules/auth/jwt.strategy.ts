import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET, // Verifique se isso está vindo do process.env no Render
});
  }

  async validate(payload: any) {
    // O que retornar aqui ficará disponível no objeto 'user' da requisição
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
