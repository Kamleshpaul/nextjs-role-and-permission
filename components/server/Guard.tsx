"use server";

import { getMyPermissions } from "@/server/queries/user";
import { ReactNode } from "react";

interface GuardProps {
  permissions: string[];
  children: ReactNode;
}

export default async function Guard({ permissions, children }: GuardProps) {
  const myPermissions = await getMyPermissions();

  const hasPermissions = permissions.every(permission =>
    myPermissions.some(x => x.permissionName === permission)
  );

  if (!hasPermissions) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}