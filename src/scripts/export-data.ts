import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching rules from SQLite database...');
  const rules = await prisma.rule.findMany();
  
  console.log(`Found ${rules.length} rules.`);
  
  const outputPath = path.join(process.cwd(), 'exported-data.json');
  fs.writeFileSync(outputPath, JSON.stringify({ rules }, null, 2));
  
  console.log(`Data exported successfully to ${outputPath}`);
}

main()
  .catch((e) => {
    console.error('Error exporting data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
