"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { logout } from "@/server/actions/user.action"

export default function Logout() {


  return <DropdownMenuItem
    onClick={() => logout()}
  >Logout</DropdownMenuItem>
}
