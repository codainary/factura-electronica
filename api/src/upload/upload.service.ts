import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class UploadService {
  constructor(private storage: StorageService, private queue: QueueService) {}
  async handleExtractUpload(file: Express.Multer.File, bank: string) {
    const key = `extracts/${Date.now()}_${file.originalname}`;
    await this.storage.putObject(process.env.MINIO_BUCKET!, key, file.buffer, { bank });
    await this.queue.enqueue({ fileKey: key, bank });
    return { ok: true, fileKey: key };
  }
}
