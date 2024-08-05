"use server"

import { getMyPermissions } from "@/server/queries/user";
import { cache } from "react";

export const hasPermission = cache(async (permissions: string[]) => {
  const myPermissions = await getMyPermissions();
  return permissions.every(permission =>
    myPermissions.some(x => x.permissionName === permission)
  );
});