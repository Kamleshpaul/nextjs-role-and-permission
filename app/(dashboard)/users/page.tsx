import { permissionList } from '@/utils/constants'
import { hasPermission } from '@/utils/guard'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function UserPage() {

  const permission = await hasPermission([permissionList.POST_SHOW]);
  if (!permission) {
    return redirect('/')
  }

  return (
    <div>You have User page access</div>
  )
}
