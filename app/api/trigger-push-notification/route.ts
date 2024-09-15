import { db, usersTable } from "@/server/database"
import webpush, { CustomPushSubscription } from "@/server/webpush";
import { eq } from "drizzle-orm"



export const GET = async (request: Request) => {

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json({
      status: false,
      message: "Missing userId"
    })
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, Number(userId)),
    with: {
      devices: true
    }
  })

  if (!user?.devices.length) {
    return Response.json({
      status: false,
      message: "No devices found"
    })
  }

  const device = user.devices[0];
  const pushSubscription = device.pushSubscription as CustomPushSubscription;
  if (!pushSubscription) {
    return Response.json({
      status: false,
      message: "No push subscription found"
    })
  }

  try {
    const res = await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: 'Test Notification',
        body: 'This is a test notification',
        icon: '/icon.png',
        url: 'https://localhost'
      })
    );

    return Response.json({
      status: true,
      message: res
    })

  } catch (error) {
    return Response.json({
      status: false,
      message: error
    })
  }
}
