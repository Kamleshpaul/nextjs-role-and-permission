import pg from "pg";
import dotenv from 'dotenv';
import { drizzle } from "drizzle-orm/node-postgres";
import * as Schema from "../../database";
import { makePassword } from "@/utils/password";
import { sql } from "drizzle-orm";
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

    await db.execute(sql`TRUNCATE TABLE role_permissions CASCADE`);
    await db.execute(sql`TRUNCATE TABLE users CASCADE`);
    await db.execute(sql`TRUNCATE TABLE roles CASCADE`);
    await db.execute(sql`TRUNCATE TABLE permissions CASCADE`);
    await db.execute(sql`ALTER SEQUENCE roles_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE permissions_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);


    // Insert roles
    const roles = await db.insert(Schema.rolesTable).values([
      { name: 'admin' },
      { name: 'editor' },
      { name: 'user' },
    ]).returning();

    // Insert permissions
    const permissions = await db.insert(Schema.permissionsTable).values([
      { name: 'post-list' },
      { name: 'post-create' },
      { name: 'post-edit' },
      { name: 'post-delete' }
    ]).returning();

    const getRoleId = (roleName: string) => {
      const role = roles.find(role => role.name === roleName);
      if (!role) {
        throw new Error(`Role ${roleName} not found`);
      }
      return role.id;
    };

    const getPermissionId = (permissionName: string) => {
      const permission = permissions.find(permission => permission.name === permissionName);
      if (!permission) {
        throw new Error(`Permission ${permissionName} not found`);
      }
      return permission.id;
    };

    const rolePermissions = [
      // Admin has all permissions
      {
        role_id: getRoleId('admin'),
        permission_id: getPermissionId('post-list')
      },
      {
        role_id: getRoleId('admin'),
        permission_id: getPermissionId('post-create')
      },
      {
        role_id: getRoleId('admin'),
        permission_id: getPermissionId('post-edit')
      },
      {
        role_id: getRoleId('admin'),
        permission_id: getPermissionId('post-delete')
      },

      // Editor has all permissions except delete
      {
        role_id: getRoleId('editor'),
        permission_id: getPermissionId('post-list')
      },
      {
        role_id: getRoleId('editor'),
        permission_id: getPermissionId('post-create')
      },
      {
        role_id: getRoleId('editor'),
        permission_id: getPermissionId('post-edit')
      },

      // User has only view permission
      {
        role_id: getRoleId('user'),
        permission_id: getPermissionId('post-list')
      }
    ];

    await db.insert(Schema.rolePermissionsTable).values(rolePermissions);
    await db.insert(Schema.usersTable).values([
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: await makePassword('password'),
        role_id: getRoleId('admin')
      }
    ]);

    console.log("Seeding completed successfully!");

  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await client.end();
  }
}

main();
