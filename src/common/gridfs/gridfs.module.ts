import { Module } from '@nestjs/common';
import { GridFsService } from './gridfs.service';
import { GridFsController } from './gridfs.controller';

@Module({
  controllers: [GridFsController],
  providers: [GridFsService],
  exports: [GridFsService],
})
export class GridFsModule {}