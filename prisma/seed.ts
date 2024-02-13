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

  const categories = await prisma.categories.createMany({
    data: [
      {
        name: 'HIJAB',
        slug: 'hijab',
        description: 'Hijab premium, nyaman, gaya elegan, bahan berkualitas.',
        sortNumber: 1,
      },
      {
        name: 'DRESS',
        slug: 'dress',
        description: 'Dress mewah yang dirancang untuk keanggunan Anda.',
        sortNumber: 2,
      },
      {
        name: 'ONE SET',
        slug: 'one-set',
        description: 'One set berkualitas: gaya unik, nyaman, elegan.',
        sortNumber: 3,
      },
      {
        name: 'BLOUSE & TUNIC',
        slug: 'blouse-and-tunic',
        description: 'Blouse dan tunik chic, nyaman, bahan premium.',
        sortNumber: 4,
      },
    ],
  });

  console.log(users, categories);
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
