import { Controller, Get, Query } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';

@Controller('reconcile')
export class ReconciliationController {
  constructor(private queue: QueueService) {}
  @Get('run')
  async runNow(@Query('fileKey') fileKey?: string, @Query('bank') bank?: string) {
    await this.queue.enqueue({ fileKey, bank: bank || 'UNKNOWN', manual: true });
    return { queued: true };
  }
}
