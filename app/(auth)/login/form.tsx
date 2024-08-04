"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/server/actions/user.action";
import { FormEvent } from "react";
import { useServerAction } from "zsa-react";

export default function LoginForm() {

  const { isPending, execute, error } = useServerAction(loginAction);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const [data, error] = await execute(formData)
    console.log(data,error)
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleLogin}
    >

      {error?.code === 'ERROR' && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Error!</span> {error.message}
        </div>
      )}

      <label className="block">
        <span className="text-gray-700">Email</span>
        <Input
          name="email"
          type="email"
          placeholder="Email address"

        />
        {error?.formattedErrors?.email && (<p className="text-red-500">{error?.formattedErrors?.email?._errors}</p>)}
      </label>

      <label className="block">
        <span className="text-gray-700">Password</span>
        <Input
          name="password"
          type="password"
          placeholder="Email address"

        />
        {error?.formattedErrors?.password && (<p className="text-red-500">{error?.formattedErrors?.password?._errors}</p>)}

      </label>

      <Button
        disabled={isPending}
        type="submit"
        className='w-full'
      >
         {isPending ? 'Sign In...' : 'Sign In'}
      </Button>

    </form>
  )
}
