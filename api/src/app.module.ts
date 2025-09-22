import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { StorageModule } from './storage/storage.module';
import { QueueModule } from './queue/queue.module';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
import { ReconciliationController } from './reconciliation/recon.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    StorageModule,
    QueueModule
  ],
  controllers: [UploadController, ReconciliationController],
  providers: [UploadService],
})
export class AppModule {}
