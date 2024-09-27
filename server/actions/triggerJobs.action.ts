'use server'

import { addToProcessOrderQueue } from "../queues/jobs/processOrder.job";
import { addToProcessUserNotificationQueue } from "../queues/jobs/processUserNotification.job";




export const processOrder = async () => {

  await addToProcessOrderQueue({
    orderId: 1,
    title: 'Iphone 16',
    amount: 10000
  })

  return {
    success: true,
    message: 'Order processed'
  };
};

export const processUserNotification = async () => {

  await addToProcessUserNotificationQueue({
    message: 'test notification',
    userId: 1
  })
  return {
    success: true,
    message: 'User notified'
  };

};