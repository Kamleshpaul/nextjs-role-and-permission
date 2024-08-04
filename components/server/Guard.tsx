"use server";

import { getMyPermissions } from "@/server/queries/user";
import { ReactNode } from "react";

interface GuardProps {
  permission: string;
  children: ReactNode;
}

export default async function Guard({ permission, children }: GuardProps) {
  const myPermission = await getMyPermissions();

  if (!myPermission.find(x => x.permissionName === permission)) {
    return null
  }

  return (
    <>
      {children}
    </>
  );
}