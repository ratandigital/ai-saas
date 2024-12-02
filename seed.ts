import { PrismaClient } from "@prisma/client"; // Using import
import prismadb from "@/lib/prismadb"; // Adjust path as necessary

const prisma = new PrismaClient();

async function main() {
  const currentDate = new Date();

  await prismadb.testApiLimit.updateMany({
    data: {
      createdAt: currentDate,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
