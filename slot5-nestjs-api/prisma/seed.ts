import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding initial data...');

  // Create or update default category
  const techCategory = await prisma.category.upsert({
    where: { name: 'Công nghệ' },
    update: {},
    create: { name: 'Công nghệ' },
  });

  const eduCategory = await prisma.category.upsert({
    where: { name: 'Giáo dục' },
    update: {},
    create: { name: 'Giáo dục' },
  });

  // Create sample users
  const alice = await prisma.user.upsert({
    where: { email: 'alice@fpt.edu.vn' },
    update: {},
    create: {
      email: 'alice@fpt.edu.vn',
      name: 'Alice Nguyen',
      role: 'ADMIN',
      posts: {
        create: [
          {
            title: 'Khám phá NestJS và Prisma ORM',
            content: 'NestJS cung cấp kiến trúc Modular mạnh mẽ kết hợp Prisma type-safe.',
            published: true,
            categoryId: techCategory.id,
          },
          {
            title: 'Học lập trình REST API với PostgreSQL',
            content: 'PostgreSQL là một trong những CSDL quan hệ mạnh mẽ nhất hiện nay.',
            published: true,
            categoryId: eduCategory.id,
          },
        ],
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@fpt.edu.vn' },
    update: {},
    create: {
      email: 'bob@fpt.edu.vn',
      name: 'Bob Tran',
      role: 'USER',
      posts: {
        create: [
          {
            title: 'Bản nháp: Xây dựng Fullstack với Next.js & NestJS',
            content: 'Ghi chú các bước thực hành Slot 5 và Slot 6.',
            published: false,
            categoryId: techCategory.id,
          },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log({ alice, bob });
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
