import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@oudnomaddubai.com';
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'OudNomadAdmin2026!';
  const firstName = process.argv[4] || 'Atelier';
  const lastName = process.argv[5] || 'Admin';

  console.log(`Setting up Admin account for ${email}...`);

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',
      emailVerified: true,
      isBlocked: false,
    },
    create: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: 'ADMIN',
      emailVerified: true,
      isBlocked: false,
    },
  });

  console.log(`✅ Administrator active: ${user.email} (ID: ${user.id}, Role: ${user.role})`);
}

main()
  .catch((err) => {
    console.error('Failed to create admin:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
