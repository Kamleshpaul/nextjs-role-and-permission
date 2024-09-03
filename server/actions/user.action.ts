"use server"

import bcrypt from 'bcryptjs';
import { createServerAction } from "zsa"
import z from "zod"
import { db, usersTable } from "../database";
import { eq } from "drizzle-orm";
import { comparePassword, makePassword } from "@/utils/password";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

function isRedirectError(error: Error & { digest?: string }) {
  return !!error.digest?.startsWith("NEXT_REDIRECT")
}

export const loginAction = createServerAction()
  .input(z.object({
    email: z.string().min(3).email(),
    password: z.string().min(3)
  }), {
    type: "formData",
  })
  .handler(async ({ input }) => {

    const user = await db.query.usersTable.findFirst({
      where: (eq(usersTable.email, input.email))
    })

    if (!user) {
      throw new Error('User not found.');
    }

    if (!await bcrypt.compare(input.password, user.password)) {
      throw new Error('User not found.');
    }


    try {
      await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirectTo: "/"
      });
    } catch (error: any) {
      if (isRedirectError(error)) throw error; //https://github.com/nextauthjs/next-auth/discussions/9389

      if (error instanceof AuthError) {
        return {
          errors: undefined,
          message: error.cause?.err?.message
        }
      }
    }


    return {
      success: true,
      data: user
    };
  });

export const registerAction = createServerAction()
  .input(z.object({
    name: z.string().min(3),
    email: z.string().min(3).email(),
    password: z.string().min(3),
    role_id: z.string().min(1)
  }), {
    type: "formData",
  })
  .handler(async ({ input }) => {

    let user = await db.query.usersTable.findFirst({
      where: (eq(usersTable.email, input.email))
    })
    if (user) {
      throw new Error('User Already exists.');
    }

    const res = await db.insert(usersTable).values({
      email: input.email,
      name: input.name,
      password: await makePassword(input.password),
      role_id: parseInt(input.role_id)
    }).returning();


    if (res[0]) {
      user = res[0];
    }

    return {
      success: true,
      data: user
    };
  });


export const logout = async () => {
  await signOut();
}
