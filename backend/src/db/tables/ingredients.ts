import { sql } from 'drizzle-orm';
import { index, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const ingredientsTable = pgTable(
  'ingredients',
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    index('ingredients_name_idx').using(
      'gin',
      sql`to_tsvector('english', ${table.name})`,
    ),
  ],
);
