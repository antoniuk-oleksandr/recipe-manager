import { integer, primaryKey, pgTable } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { recipesTable } from './recipes';

export const favouriteRecipesTable = pgTable(
  'favourite_recipes',
  {
    userId: integer('user_id')
      .references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    recipeId: integer('recipe_id')
      .references(() => recipesTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
  },
  (table) => [
    primaryKey({
      name: 'favourite_recipes_pk',
      columns: [table.userId, table.recipeId],
    }),
  ],
);
