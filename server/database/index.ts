import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pgTable, text, integer, serial, boolean, json } from 'drizzle-orm/pg-core';
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


export const passKeysTable = pgTable("pass_keys", {
  id: serial("id").primaryKey(),
  credentialID: text('credential_id').notNull(),
  credentialPublicKey: text('credential_public_key').notNull(),
  counter: text("counter").notNull(),
  credentialDeviceType: text("credential_device_type").notNull(),
  credentialBackedUp: text("credential_backed_up").notNull(),
  transports: json('transports').$type<string[]>().notNull(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
});




export const userRelations = relations(usersTable, ({ one, many }) => ({
  role: one(rolesTable, {
    fields: [usersTable.role_id],
    references: [rolesTable.id]
  }),
  passKeys: many(passKeysTable)
}));

export const roleRelations = relations(rolesTable, ({ many }) => ({
  users: many(usersTable),
  permissions: many(permissionsTable)
}));

export const permissionRelations = relations(permissionsTable, ({ many }) => ({
  roles: many(rolePermissionsTable)
}))

export const passKeysRelations = relations(passKeysTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [passKeysTable.user_id],
    references: [usersTable.id]
  }),
}))



export const db = drizzle(pool, {
  schema: {
    rolesTable,
    permissionsTable,
    usersTable,
    userRelations,
    roleRelations,
    permissionRelations,
    passKeysTable,
    passKeysRelations
  }
});


export type IUser = typeof usersTable.$inferSelect;
export type IRole = typeof rolesTable.$inferSelect;
export type IPassKey = typeof passKeysTable.$inferSelect;

export type IUserWithPassKeys = IUser & {
  passKeys: IPassKey[];
};