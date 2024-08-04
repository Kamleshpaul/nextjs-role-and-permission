"use server"

import { getMyPermissions } from "@/server/queries/user";
import { cache } from "react";

export const hasPermission = cache(async (permission: string) => {
  const myPermission = await getMyPermissions();
  return myPermission.find(x => x.permissionName === permission);
})