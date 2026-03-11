import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import helmet from 'helmet';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Segurança
  app.use(helmet());
  
  // 2. CORS (Ajuste para seu domínio de produção)
  app.enableCors({
    origin: [
      'https://www.soth.com.br', 
      'https://soth.com.br',
      'http://localhost:5173'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. Limite de tamanho para upload de fotos
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // 4. Pipes e Interceptores
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true 
  }));
  app.useGlobalInterceptors(new TransformInterceptor());

  // 5. Prefixo Global
  app.setGlobalPrefix('api/v1');

  // 6. Porta
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 SOTH BACKEND inicializado na porta ${port}`);
}

bootstrap();
