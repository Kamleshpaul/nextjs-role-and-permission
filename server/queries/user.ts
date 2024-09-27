import { eq } from "drizzle-orm"
import { db, permissionsTable, rolePermissionsTable, rolesTable, usersTable } from "../database"
import { auth } from "@/auth";
import { cache } from "react";

export const getRoles = cache(async () => {
  const result = await db.query.rolesTable.findMany();
  if (!result) throw Error('No Roles found.');
  return result;
})

export const getCurrentUser = cache(async () => {
  const session = await auth();
  const result = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, session?.user.email),
    with: {
      role: true
    }
  })
  if (!result) {
    throw Error('No Users found.')
  };
  return result;
})

export const getUserByEmailAndPassword = async (email: string) => {
  const result = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
    with: {
      passKeys: true
    }
  });
  if (!result) throw Error('No Users found.');
  return result;
}


export const getMyPermissions = cache(async () => {
  const session = await auth();
  if (!session?.user?.role_id) {
    throw new Error("Role id not found in session.");
  }

  const permissions = await db
    .select({
      permissionName: permissionsTable.name
    })
    .from(rolePermissionsTable)
    .innerJoin(permissionsTable, eq(rolePermissionsTable.permission_id, permissionsTable.id))
    .where(eq(rolePermissionsTable.role_id, session.user.role_id));

  return permissions;
});
