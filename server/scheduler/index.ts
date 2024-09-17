import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { sendReminderEmails } from './jobs/reminderEmails';
import { logCleanup } from './jobs/logCleanup';
import SchedulerHelper from './SchedulerHelper';

type schedulerType = {
  name: string;
  corn: string;
  handler: () => Promise<void>;
}


export const connection = new Redis('redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
export const schedulerQueue = new Queue('scheduler', { connection });


/**
 * Scheduler Array
 * Defines scheduled tasks with name, cron, and handler.
 */
const scheduler: schedulerType[] = [
  {
    name: 'send-reminder-emails',
    corn: SchedulerHelper.everyFiveSeconds(),
    handler: sendReminderEmails,
  },
  {
    name: 'log-cleanup',
    corn: SchedulerHelper.everySecond(),
    handler: logCleanup,
  }
];




const cleanOldJobs = async () => {
  const repeatableJobs = await schedulerQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    console.log(`Removing old job: ${job.name} with key: ${job.key}`);
    await schedulerQueue.removeRepeatableByKey(job.key);
  }
};


const main = async () => {

  await cleanOldJobs();  // comment this if you don't want 
  for (const task of scheduler) {

    await schedulerQueue.add(task.name, {}, {
      repeat: { pattern: task.corn },
    });

  }


  new Worker(
    'scheduler',
    async job => {
      const task = scheduler.find(t => t.name === job.name);
      if (task && task.handler) {
        await task.handler();
      }
    },
    {
      connection,
      removeOnComplete: { count: 10 },
      removeOnFail: { count: 50 }
    },
  );
  const repeatableJobs = await schedulerQueue.getRepeatableJobs();
  console.table(repeatableJobs);
};

main().catch(err => console.error('Scheduler Error:', err));
