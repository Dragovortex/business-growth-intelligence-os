import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(process.cwd(), 'exported-data.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const { rules } = JSON.parse(raw);

  console.log(`Importing ${rules.length} rules to Supabase...`);

  // Import in batches of 100 to avoid timeout
  const batchSize = 100;
  let imported = 0;

  for (let i = 0; i < rules.length; i += batchSize) {
    const batch = rules.slice(i, i + batchSize).map((rule: any) => ({
      ...rule,
      dateAdded: new Date(rule.dateAdded),
      lastUpdated: new Date(rule.lastUpdated),
    }));

    await prisma.rule.createMany({
      data: batch,
      skipDuplicates: true,
    });

    imported += batch.length;
    console.log(`  Imported ${imported}/${rules.length} rules...`);
  }

  console.log(`\n✅ Successfully imported ${imported} rules to Supabase!`);
}

main()
  .catch((e) => {
    console.error('Error importing data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
