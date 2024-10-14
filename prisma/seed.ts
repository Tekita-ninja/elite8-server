import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';
async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'WeSuper',
        username: 'superuser',
        hashedPassword: bcrypt.hashSync('Billiard888999', 10),
        role: 'SUPER',
      },
      {
        name: 'I am admin 1',
        username: 'admin1',
        hashedPassword: bcrypt.hashSync('Billiard888999', 10),
        role: 'ADMIN',
      },
    ],
  });
  const utility = await prisma.utility.create({
    data: {
      appName: '8BallJos',
      logoSmall: 'default-logo-small.png',
      logoFull: 'default-logo-full.png',
    },
  });
  console.log(users, utility);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
