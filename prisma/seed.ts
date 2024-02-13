import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';
async function main() {
  const users = await prisma.users.createMany({
    data: [
      {
        name: 'Uut Budiarto',
        email: 'super@gmail.com',
        hashedPassword: bcrypt.hashSync('888999', 10),
        role: 'SUPER',
      },
      {
        name: 'Aji Sasmito',
        email: 'admin@gmail.com',
        hashedPassword: bcrypt.hashSync('888999', 10),
        role: 'ADMIN',
      },
      {
        name: 'User Staff',
        email: 'user@gmail.com',
        hashedPassword: bcrypt.hashSync('888999', 10),
        role: 'USER',
      },
    ],
  });

  console.log(users);
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
