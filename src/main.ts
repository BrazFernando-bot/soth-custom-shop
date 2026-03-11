import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import helmet from 'helmet';
import { json, urlencoded } from 'express'; // <--- 1. ADICIONE ESTE IMPORT

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
  whitelist: true, // Remove campos que não estão no DTO
  forbidNonWhitelisted: true, // Dá erro se enviar campos extras
  transform: true, // Converte tipos (ex: string "10" vira number 10)
}));

  app.use(helmet());
  app.enableCors({
  origin: ['https://www.soth.com.br', 'http://localhost:5173'], // Adicione o seu domínio real aqui!
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}); 

  // 2. ADICIONE ESTAS DUAS LINHAS PARA ACEITAR FOTOS GRANDES
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 SOTH BACKEND inicializado na porta ${port}`);
}
bootstrap();
