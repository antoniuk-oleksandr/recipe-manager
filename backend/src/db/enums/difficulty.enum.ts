import { pgEnum } from 'drizzle-orm/pg-core';

export const difficultyEnum = pgEnum('difficulty', ['Easy', 'Medium', 'Hard']);
