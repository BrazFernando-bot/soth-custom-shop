import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// 1. Carrega as variáveis do .env
dotenv.config();

// 2. Cria o cliente FORA da função para ele ser global no arquivo
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 O script de SEED começou...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  console.log('🌱 Semeando banco de dados...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@soth.com' },
    update: {}, // Se já existir, não faz nada
    create: {
      email: 'admin@soth.com',
      name: 'Diretor Soth',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin criado ou já existente:', admin.email);
}

// 3. Execução do script
main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Agora o prisma é visível aqui e o erro vai sumir
    await prisma.$disconnect();
  });