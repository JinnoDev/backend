import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    uploadFile(buffer: Buffer, folder: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder, resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result!.secure_url);
                },
            );
            streamifier.createReadStream(buffer).pipe(uploadStream);
        });
    }

    async deleteFile(url: string): Promise<void> {
        try {
            // Extract public_id from Cloudinary URL
            const parts = url.split('/');
            const folder = parts[parts.length - 2];
            const filename = parts[parts.length - 1].split('.')[0];
            const publicId = `${folder}/${filename}`;
            await cloudinary.uploader.destroy(publicId);
        } catch {
            // Ignore errors on delete
        }
    }
}