import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class StorageService {
  private client: Minio.Client;
  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });
  }
  async putObject(bucket: string, key: string, buffer: Buffer, meta?: any) {
    const exists = await this.client.bucketExists(bucket).catch(() => false);
    if (!exists) await this.client.makeBucket(bucket, process.env.MINIO_REGION || 'us-east-1');
    await this.client.putObject(bucket, key, buffer, meta);
    return { bucket, key };
  }
}
