import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { comparePassword } from "@/utils/password"
import { getUserByEmailAndPassword } from "./server/queries/user"
import { User } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        credentialID: {}
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;
        const credentialID = credentials.credentialID as string;

        const user = await getUserByEmailAndPassword(email);
        if (!user) {
          throw new Error("User not found.");
        }


        if (!credentialID && user.passKeys.map(key => key.credentialID).includes(credentialID)) {
          const isPasswordValid = await comparePassword({ plainPassword: password, hashPassword: user.password });
          if (!isPasswordValid) {
            throw new Error("Invalid password.");
          }

        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role_id: user.role_id,
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role_id) {
        token.role_id = user.role_id
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role_id: token.role_id as string,
        },
      };
    },
  },
});
