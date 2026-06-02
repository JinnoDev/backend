"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridFsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongodb_1 = require("mongodb");
const stream_1 = require("stream");
const mongodb_2 = require("mongodb");
let GridFsService = class GridFsService {
    constructor(connection) {
        this.connection = connection;
    }
    onModuleInit() {
        this.bucket = new mongodb_1.GridFSBucket(this.connection.db, {
            bucketName: 'uploads',
        });
    }
    getBucket() {
        return this.bucket;
    }
    async uploadFile(buffer, filename) {
        return new Promise((resolve, reject) => {
            const uploadStream = this.bucket.openUploadStream(filename);
            stream_1.Readable.from(buffer)
                .pipe(uploadStream)
                .on('error', reject)
                .on('finish', () => {
                resolve(uploadStream.id.toString());
            });
        });
    }
    async deleteFile(id) {
        try {
            await this.bucket.delete(new mongodb_2.ObjectId(id));
        }
        catch {
        }
    }
};
exports.GridFsService = GridFsService;
exports.GridFsService = GridFsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], GridFsService);
//# sourceMappingURL=gridfs.service.js.map