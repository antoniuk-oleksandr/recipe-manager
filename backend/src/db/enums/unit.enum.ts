import { pgEnum } from 'drizzle-orm/pg-core';

export const unitEnum = pgEnum('unit', [
  'g',
  'kg',
  'ml',
  'l',
  'cup',
  'tbsp',
  'tsp',
  'piece',
  'slice',
  'clove',
  'can',
  'bunch',
  'drop',
]);
