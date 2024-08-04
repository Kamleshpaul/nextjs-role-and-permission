"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerAction } from '@/server/actions/user.action';
import { IRole } from '@/server/database';
import React, { FormEvent, useState } from 'react'
import { useServerAction } from 'zsa-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


export default function RegisterForm({ roles }:{roles:IRole[]}) {

  const [selectedRole, setSelectedRole] = useState<string>('');
  const { isPending, execute, error } = useServerAction(registerAction);
  const router = useRouter();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    formData.append("role_id", selectedRole);
    const [data, error] = await execute(formData)
    if(data?.success){
      toast.success("User Register successfully.")
      router.push('/login');
      return;
    }
    toast.error("Something went wrong.")
  }

  return (
    <form
      className="space-y-4"
       onSubmit={handleRegister}
    >

    {error?.code === 'ERROR' && (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        <span className="font-medium">Error!</span> {error.message}
      </div>
    )}

      <label className="block">
        <span className="text-gray-700">Name</span>
        <Input
          type="text"
          name="name"
          placeholder='Enter name'
        />
        {error?.formattedErrors?.name && (<p className="text-red-500">{error?.formattedErrors?.name?._errors}</p>)}

      </label>

      <label className="block">
        <span className="text-gray-700">Email</span>
        <Input
          type="email"
          name="email"
          placeholder='Enter email'
        />
        {error?.formattedErrors?.email && (<p className="text-red-500">{error?.formattedErrors?.email?._errors}</p>)}
      </label>
      <label className="block">
        <span className="text-gray-700">Password</span>
        <Input
          type="password"
          name="password"
          placeholder='Enter password'
        />
        {error?.formattedErrors?.password && (<p className="text-red-500">{error?.formattedErrors?.password?._errors}</p>)}

      </label>

      <label className="block">
        <Select onValueChange={e => setSelectedRole(e)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role=> (
              <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
            ))}

          </SelectContent>
        </Select>
        {error?.formattedErrors?.password && (<p className="text-red-500">{error?.formattedErrors?.password?._errors}</p>)}

      </label>

      <Button
        disabled={isPending}
        type="submit"
        className='w-full'
      >

        {isPending ? 'Register...' : 'Register'}
      </Button>
    </form>
  )
}
