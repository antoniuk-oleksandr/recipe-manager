import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { recipesTable } from './recipes';
import { unitEnum } from '../enums/unit.enum';
import { ingredientsTable } from './ingredients';

export const recipesIngredientsTable = pgTable(
  'recipes_ingredients',
  {
    recipeId: integer('recipe_id')
      .references(() => recipesTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    ingredientId: integer('ingredient_id')
      .references(() => ingredientsTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    amount: integer().notNull(),
    unit: unitEnum().notNull(),
  },
  (table) => [
    primaryKey({
      name: 'recipes_ingredients_pk',
      columns: [table.recipeId, table.ingredientId],
    }),
  ],
);
