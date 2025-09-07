import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const recipesTagsTable = pgTable(
  'recipes_tags',
  {
    recipeId: integer('recipe_id').notNull(),
    tagId: integer('tag_id').notNull(),
  },
  (table) => [
    primaryKey({
      name: 'recipes_tags_pk',
      columns: [table.recipeId, table.tagId],
    }),
  ],
);
