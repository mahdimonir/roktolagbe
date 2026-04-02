import './config/env'; // validate env vars first
import app from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(env.PORT, () => {
      console.log(`🚀 RoktoLagbe API running on http://localhost:${env.PORT}`);
      console.log(`📌 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
