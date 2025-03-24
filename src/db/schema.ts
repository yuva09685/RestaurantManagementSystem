import { pgTable, integer, text, pgEnum, serial, varchar } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['manager', 'waiter']);

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: varchar({ length: 10 }).notNull().$type<"manager" | "waiter">().default("waiter"),
});

export const tablesTable = pgTable('tables', {
  id: serial('id').primaryKey(),
  waiterId: integer('waiter_id').notNull(),
  tableNumber: text('table_number').notNull(),
});
