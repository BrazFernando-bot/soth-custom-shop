import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import helmet from 'helmet';
import { json, urlencoded } from 'express'; // <--- 1. ADICIONE ESTE IMPORT

// ... imports
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // PREFIXO GLOBAL - OBRIGATÓRIO PARA O NESTJS ENTENDER O /api/v1
  app.setGlobalPrefix('api/v1');

  // BLINDAGEM CORS - LIBERANDO SEU DOMÍNIO
  app.enableCors({
    origin: ['https://www.soth.com.br', 'https://soth.com.br'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ... restante do código
  await app.listen(process.env.PORT || 3000);
}

  app.use(helmet());
  // No src/main.ts
app.enableCors({
  origin: [
    'https://soth.com.br', 
    'https://www.soth.com.br',
    'http://localhost:5173' // Deixe aqui para testar localmente
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
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
