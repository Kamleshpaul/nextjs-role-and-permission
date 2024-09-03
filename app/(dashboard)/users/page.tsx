import { permissionList } from '@/utils/constants'
import { hasPermission } from '@/utils/guard'
import { redirect } from 'next/navigation';
import React from 'react'
import RegisterDevice from './RegisterDevice';

export default async function UserPage() {

  const permission = await hasPermission([permissionList.POST_SHOW]);
  if (!permission) {
    return redirect('/')
  }

  return (
    <div className='flex justify-center items-center h-screen flex-col gap-10'>
      <p>
        You have User page access
      </p>
      <RegisterDevice />
    </div>
  )
}
