import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  queue: Queue;
  constructor() {
    this.queue = new Queue('reconcile', {
      connection: { host: process.env.REDIS_HOST!, port: parseInt(process.env.REDIS_PORT || '6379') },
      defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    });
  }
  async enqueue(payload: any) { await this.queue.add('reconcile', payload); }
}
