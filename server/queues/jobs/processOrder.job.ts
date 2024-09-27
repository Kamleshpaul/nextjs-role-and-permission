import { redisConnection } from "@/server/redis";
import { Queue, Worker } from "bullmq";
import { defaultQueueConfig } from "../config";


const queueName = 'processOrder';
interface QueueInterface {
  orderId: number;
  title: string;
  amount: number;
}

const processOrderQueue = new Queue(queueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueConfig,
    delay: 500,
  }
});



new Worker(queueName,
  async (job) => {

    /**
     * Handle the job
     * 
     */
    const data: QueueInterface = job.data;
    console.log('Processed order:', data);



  }, {
  connection: redisConnection
});


export const addToProcessOrderQueue = (data: QueueInterface) => {
  return processOrderQueue.add(queueName, data);
};