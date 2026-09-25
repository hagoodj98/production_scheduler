import { resource } from '../../lib/repositories/resource';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

type ResourceRow = {
  resource_name: string;
};
const seedResources = async () => {
  //Load CSV file
  const csvPath = path.join(process.cwd(), 'prisma', 'data', 'resources.csv');
  const file = fs.readFileSync(csvPath, 'utf8');

  //Parse CSV
  const records = parse<ResourceRow>(file, {
    columns: true,
    skip_empty_lines: true,
  });
  //Insert resources/jobs one by one
  for (const row of records) {
    await resource.upsert(row.resource_name);
  }
};
export default seedResources;
