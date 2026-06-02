import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';

@Injectable()
export class GridFsService implements OnModuleInit {
  private bucket: GridFSBucket;

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  onModuleInit() {
    this.bucket = new GridFSBucket(
      this.connection.db as any,
      {
        bucketName: 'uploads',
      },
    );
  }

  getBucket() {
    return this.bucket;
  }

  async uploadFile(
    buffer: Buffer,
    filename: string,
  ): Promise<string> { 
  return new Promise((resolve, reject) => {
    const uploadStream = this.bucket.openUploadStream(filename);

    Readable.from(buffer)
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => {
        resolve(uploadStream.id.toString());
      });
  });
}
  async deleteFile(id: string) {
    try {
      await this.bucket.delete(new ObjectId(id));
    } catch {
      // ignorar si no existe
    }
  }
}