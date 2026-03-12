import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // REGISTRO DE CLIENTE
  async register(data: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (userExists) throw new ConflictException('Este e-mail já está cadastrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // CORREÇÃO: Use o Enum Role que o Prisma entende
    const roleValue = (data.role?.toUpperCase() === 'ADMIN') ? Role.ADMIN : Role.CLIENT;

    const user = await this.prisma.user.create({
      data: { 
        ...data, 
        password: hashedPassword,
        role: roleValue // <--- Agora ele recebe o tipo correto
      },
    });

    const { password, ...result } = user;
    return result;
  }
  // LOGIN (Gera o Token JWT)
  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  // ROTA DE EMERGÊNCIA PARA CRIAR O ADMIN
  async createFirstAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await this.prisma.user.upsert({
      where: { email: 'admin@soth.com' },
      update: {},
      create: {
        email: 'admin@soth.com',
        name: 'Diretor Soth',
        password: hashedPassword,
        role: Role.ADMIN, // <--- Aqui também
      },
    });
    return { message: 'Admin criado!', email: admin.email };
  }
}
