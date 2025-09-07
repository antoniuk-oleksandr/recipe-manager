import { sql } from 'drizzle-orm';
import { index } from 'drizzle-orm/gel-core';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tagsTable = pgTable(
  'tags',
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).unique().notNull(),
  },
  (table) => [
    index('tags_name_idx').using(
      'gin',
      sql`to_tsvector('english', ${table.name})`,
    ),
  ],
);
