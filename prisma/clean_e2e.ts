import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function clean() {
  const r = await p.user.deleteMany({ where: { email: 'e2e.golden@example.com' } });
  console.log('Cleaned test users:', r.count);
}
clean().finally(() => p.$disconnect());
