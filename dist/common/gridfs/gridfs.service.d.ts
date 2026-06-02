import { OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
import { GridFSBucket } from 'mongodb';
export declare class GridFsService implements OnModuleInit {
    private readonly connection;
    private bucket;
    constructor(connection: Connection);
    onModuleInit(): void;
    getBucket(): GridFSBucket;
    uploadFile(buffer: Buffer, filename: string): Promise<string>;
    deleteFile(id: string): Promise<void>;
}
