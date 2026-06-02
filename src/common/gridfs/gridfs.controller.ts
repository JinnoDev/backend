import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { GridFsService } from './gridfs.service';

@Controller('uploads')
export class GridFsController {
  constructor(private readonly gridFsService: GridFsService) {}

  @Get(':id')
  async getFile(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const bucket = this.gridFsService.getBucket();

    const files = await bucket.find({
      _id: new ObjectId(id),
    }).toArray();

    if (!files.length) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const file: any = files[0];

    res.set({
    'Content-Type': file.contentType || 'application/octet-stream',
    });
    
    bucket.openDownloadStream(new ObjectId(id)).pipe(res);
  }
}