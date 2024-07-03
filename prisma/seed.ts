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
  const contacts = await prisma.contacts.createMany({
    data: [
      {
        name: 'Telepon',
        icon: 'contacts/phone.png',
        value: '089688889999',
        type: 'PHONE',
      },
      {
        name: 'Whatsapp',
        icon: 'contacts/wa.png',
        value: '089600009999',
        type: 'WHATSAPP',
      },
      {
        name: 'Email',
        icon: 'contacts/email.png',
        value: 'admin@koselani.com',
        type: 'EMAIL',
      },
    ],
  });
  const socials = await prisma.socials.createMany({
    data: [
      {
        name: 'Facebook',
        icon: 'socials/facebook.png',
        link: 'https://facebook.com',
        status: true,
      },
      {
        name: 'Instagram',
        icon: 'socials/instagram.png',
        link: 'https://instagram.com/_uutbudiarto',
        status: true,
      },
      {
        name: 'Youtube',
        icon: 'socials/youtube.png',
        link: 'https://youtube.com',
        status: true,
      },
    ],
  });
  const stores = await prisma.stores.createMany({
    data: [
      {
        name: 'Shopee',
        icon: 'stores/shopee.png',
        link: 'https://shopee.com',
        status: true,
      },
      {
        name: 'Tiktok',
        icon: 'stores/tiktok.png',
        link: 'https://tiktok.com',
        status: true,
      },
    ],
  });
  const payments = await prisma.payments.createMany({
    data: [
      {
        name: 'BCA',
        icon: 'payments/bca.png',
        holder: 'Jhon Paul',
        number: '000111222',
        status: true,
      },
      {
        name: 'MANDIRI',
        icon: 'payments/mandiri.png',
        holder: 'Jhon Paul',
        number: '000011112222',
        status: true,
      },
    ],
  });
  const couriers = await prisma.couriers.createMany({
    data: [
      {
        name: 'JNE',
        icon: 'couriers/jne.png',
        value: 'jne',
        status: true,
      },
      {
        name: 'JNT',
        icon: 'couriers/jnt.png',
        value: 'jnt',
        status: true,
      },
    ],
  });
  const utils = await prisma.utils.create({
    data: {
      appName: 'Koselani Premium',
      logoSmall: 'logo-small.png',
      logoFull: 'logo-full.png',
      videoProfile: 'video.png',
      mainEmail: 'admin@koselanipermium.com',
      mainWhatsApp: '082278789999',
      mainPhone: '082278789999',
    },
  });

  console.log(
    users,
    categories,
    contacts,
    socials,
    stores,
    payments,
    couriers,
    utils,
  );
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
