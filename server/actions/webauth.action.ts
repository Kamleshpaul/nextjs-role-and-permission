'use server'

import { auth, signIn } from "@/auth"
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON, AuthenticationResponseJSON, AuthenticatorTransportFuture } from '@simplewebauthn/types'
import { db, IUserWithPassKeys, passKeysTable, usersTable } from "../database";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isoBase64URL } from '@simplewebauthn/server/helpers';

const RP_ID = "localhost";
const rpName = "Coding Tricks";
const CLIENT_URL = "https://localhost:3000";


export const getRegistrationOptions = async () => {
  const session = await auth();

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, session?.user.email),
  })
  if (!user) return null;

  const options = await generateRegistrationOptions({
    rpID: RP_ID,
    rpName: rpName,
    userName: user.email,
    userID: user.id.toString(),
  });

  return options

}

export const registerDevice = async (registration: RegistrationResponseJSON, challenge: string) => {
  const session = await auth();

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, session?.user.email)
  })
  if (!user) {
    return {
      status: false,
      message: "User not found."
    }
  }

  const verification = await verifyRegistrationResponse({
    response: registration,
    expectedChallenge: challenge,
    expectedRPID: RP_ID,
    expectedOrigin: CLIENT_URL,
  })



  if (verification.verified && verification.registrationInfo) {

    await db.insert(passKeysTable).values({
      credentialID: isoBase64URL.fromBuffer(verification.registrationInfo.credentialID),
      credentialPublicKey: isoBase64URL.fromBuffer(verification.registrationInfo.credentialPublicKey),
      counter: String(verification.registrationInfo.counter),
      credentialDeviceType: verification.registrationInfo.credentialDeviceType,
      credentialBackedUp: verification.registrationInfo.credentialBackedUp ? "true" : "false",
      transports: registration.response.transports as AuthenticatorTransportFuture[],
      user_id: user.id,
    });

    return {
      status: true,
      message: "Device Registered successfully."
    }
  } else {
    return {
      status: false,
      message: "Something went wrong."
    }
  }

}
export const getAuthenticationOptions = async (email: string) => {

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
    with: {
      passKeys: true
    }
  })
  if (!user) return {
    status: false,
    message: "User not found."
  };

  const options = await generateAuthenticationOptions({
    rpID: 'localhost',
    allowCredentials: user.passKeys.map((passKey) => ({ // allow all the device for this user
      id: isoBase64URL.toBuffer(passKey.credentialID),
      type: 'public-key',
      transports: passKey.transports as AuthenticatorTransportFuture[],
    }))
  });

  if (options?.rpId) return {
    status: true,
    message: "Option generated",
    data: {
      options,
      userId: user.id,
    }
  };

  return {
    status: false,
    message: "Something went wrong."
  }

}

export const verifyAuthenticationResponseAction = async (
  response: AuthenticationResponseJSON,
  user_id: number,
  challenge: string
) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, user_id),
    with: {
      passKeys: true
    }
  }) as IUserWithPassKeys | undefined;


  if (!user) {
    return {
      status: false,
      message: "User not found."
    };
  }

  const matchingPassKey = user.passKeys.find((passKey) => passKey.credentialID == response.rawId);

  if (!matchingPassKey) {
    return {
      status: false,
      message: "Device not found."
    };
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: CLIENT_URL,
    expectedRPID: RP_ID,
    authenticator: {
      credentialID: isoBase64URL.toBuffer(matchingPassKey.credentialID),
      credentialPublicKey: isoBase64URL.toBuffer(matchingPassKey.credentialPublicKey),
      counter: Number(matchingPassKey.counter),
      transports: matchingPassKey.transports as AuthenticatorTransportFuture[],
    },
  });

  if (verification.verified) {
    await db.update(passKeysTable)
      .set({ counter: String(verification.authenticationInfo.newCounter) })
      .where(eq(passKeysTable.credentialID, matchingPassKey.credentialID));


    try {
      await signIn("credentials", {
        email: user.email,
        credentialID: matchingPassKey.credentialID,
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

  } else {
    return {
      status: false,
      message: "Authentication failed."
    };
  }
};



