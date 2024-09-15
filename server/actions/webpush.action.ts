'use server'

import { devicesTable } from '../database';
import { db } from '../database';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '../queries/user';


export async function subscribeUser(sub: any) {
  const user = await getCurrentUser();
  if (!user.id) {
    return {
      success: false
    }
  }

  const existingSubscription = await db.query.devicesTable.findFirst({
    where: eq(devicesTable.userId, user.id)
  });

  if (existingSubscription) {
    await db.update(devicesTable).set({
      pushSubscription: sub
    }).where(eq(devicesTable.id, existingSubscription.id));
  } else {
    await db.insert(devicesTable).values({
      pushSubscription: sub,
      userId: user.id
    });
  }

  return { success: true };
}
