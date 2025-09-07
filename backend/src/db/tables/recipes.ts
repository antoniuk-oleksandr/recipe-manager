import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { usersTable } from './users';
import { difficultyEnum } from '../enums/difficulty.enum';

export const recipesTable = pgTable(
  'recipes',
  {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 2000 }).notNull(),
    instructions: varchar({ length: 2000 }).notNull(),
    difficulty: difficultyEnum().notNull(),
    cookingTime: integer('cooking_time').notNull(),
    servings: integer().notNull(),
    isPublic: boolean('is_public').default(false).notNull(),
    userId: integer('user_id')
      .references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
  },
  (table) => [
    index('title_search_index').using(
      'gin',
      sql`to_tsvector('english', ${table.title})`,
    ),
    index('recipes_public_filter_index')
      .on(table.difficulty, table.cookingTime, table.servings)
      .where(sql`${table.isPublic} = true`),
  ],
);
