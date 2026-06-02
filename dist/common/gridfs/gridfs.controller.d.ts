import { Response } from 'express';
import { GridFsService } from './gridfs.service';
export declare class GridFsController {
    private readonly gridFsService;
    constructor(gridFsService: GridFsService);
    getFile(id: string, res: Response): Promise<void>;
}
