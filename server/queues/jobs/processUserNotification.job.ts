import { redisConnection } from "@/server/redis";
import { Queue, Worker } from "bullmq";
import { defaultQueueConfig } from "../config";


const queueName = 'processUserNotification';
type QueueInterface = {
  userId: number;
  message: string;
}



const processUserNotificationQueue = new Queue<QueueInterface>(queueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueConfig,
    delay: 500,
  }
});



new Worker<QueueInterface>(queueName,
  async (job) => {

    /**
    * Handle the job
    * 
    */

    const data: QueueInterface = job.data;
    console.log('Processed user notification:', data);

  }, {
  connection: redisConnection
});


export const addToProcessUserNotificationQueue = (data: QueueInterface) => {
  return processUserNotificationQueue.add(queueName, data);
};