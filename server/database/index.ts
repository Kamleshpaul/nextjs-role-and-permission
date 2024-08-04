import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pgTable, text, integer, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

export const rolesTable = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const permissionsTable = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role_id: integer('role_id').references(() => rolesTable.id).notNull(),
});

export const rolePermissionsTable = pgTable('role_permissions', {
  role_id: integer('role_id').references(() => rolesTable.id).notNull(),
  permission_id: integer('permission_id').references(() => permissionsTable.id).notNull(),
});

export const userRelations = relations(usersTable, ({ one }) => ({
  role: one(rolesTable, {
    fields: [usersTable.role_id],
    references: [rolesTable.id]
  })
}));

export const roleRelations = relations(rolesTable, ({ many }) => ({
  users: many(usersTable),
  permissions: many(permissionsTable)
}));

export const permissionRelations = relations(permissionsTable, ({ many }) => ({
  roles: many(rolePermissionsTable)
}))


export const db = drizzle(pool, {
  schema: {
    rolesTable,
    permissionsTable,
    usersTable,
    userRelations,
    roleRelations,
    permissionRelations
  }
});


export type IUser = typeof usersTable.$inferSelect;
export type IRole = typeof rolesTable.$inferSelect;
