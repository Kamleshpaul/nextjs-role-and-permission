import Redis from 'ioredis';

export const redisConnection = new Redis('redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});