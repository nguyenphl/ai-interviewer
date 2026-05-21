import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const adapter = new PrismaBetterSqlite3({
  url: path.join(process.cwd(), "prisma/dev.db"),
});
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  await prisma.userModel.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
  console.log("✓ Seeded UserModel singleton");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
