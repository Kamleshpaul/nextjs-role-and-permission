import { and, eq } from "drizzle-orm"
import { db, rolesTable, usersTable } from "../database"
import { auth } from "@/auth";

export const getRoles = async () => {
  const result = await db.query.rolesTable.findMany();
  if (!result) throw Error('No Roles found.');
  return result;
}


export const  getUserByEmailAndPassword =  async (email:string) => {
  const result = await db.query.usersTable.findFirst({
    where:eq(usersTable.email,email)
  });
  if (!result) throw Error('No Usres found.');
  return result;
}


export const getMyPermissions = async () => {
  const session = await auth();
  if (!session?.user?.role_id) {
    throw new Error("Role ID not found in session.");
  }

  const roleWithPermission = await db.query.rolesTable.findFirst({
    where:eq(rolesTable.id, session.user.role_id),
    with:{
      permissions:true
    }
  })

  if (!roleWithPermission) {
    console.log("No permissions found for role ID:", session.user.role_id);
    return;
  }

  console.log("Permissions for role ID:", session.user.role_id, roleWithPermission);
};
