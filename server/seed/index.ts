import pg from "pg";
import dotenv from 'dotenv';
import { drizzle } from "drizzle-orm/node-postgres";
import * as Schema from "../database";
dotenv.config();

export const client = new pg.Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

async function main() {
  try {
    await client.connect();
    const db = drizzle(client, {
      schema: Schema
    });

    // Insert roles
    const roles = await db.insert(Schema.rolesTable).values([
      { name: 'admin' },
      { name: 'editor' },
      { name: 'user' }
    ]).returning();

    // Insert permissions
    const permissions = await db.insert(Schema.permissionsTable).values([
      { name: 'post-list' },
      { name: 'post-create' },
      { name: 'post-edit' },
      { name: 'post-delete' }
    ]).returning();

    if (!roles?.length) {
      return;
    }

    // Insert role_permissions
    const rolePermissions = [
      // Admin has all permissions
      {
        role_id: roles.find(role => role.name === 'admin')?.id,
        permission_id: permissions.find(permission => permission.name === 'post-list').id
      },
      {
        role_id: roles.find(role => role.name === 'admin').id,
        permission_id: permissions.find(permission => permission.name === 'post-create').id
      },
      {
        role_id: roles.find(role => role.name === 'admin').id,
        permission_id: permissions.find(permission => permission.name === 'post-edit').id
      },
      {
        role_id: roles.find(role => role.name === 'admin').id,
        permission_id: permissions.find(permission => permission.name === 'post-delete').id
      },

      // Editor has all permissions except delete
      {
        role_id: roles.find(role => role.name === 'editor').id,
        permission_id: permissions.find(permission => permission.name === 'post-list').id
      },
      {
        role_id: roles.find(role => role.name === 'editor').id,
        permission_id: permissions.find(permission => permission.name === 'post-create').id
      },
      {
        role_id: roles.find(role => role.name === 'editor').id,
        permission_id: permissions.find(permission => permission.name === 'post-edit').id
      },

      // User has only view permission
      {
        role_id: roles.find(role => role.name === 'user').id,
        permission_id: permissions.find(permission => permission.name === 'post-list').id
      }
    ];

    await db.insert(Schema.rolePermissionsTable).values(rolePermissions);

    console.log("Seeding completed successfully!");

  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await client.end();
  }
}

main();
