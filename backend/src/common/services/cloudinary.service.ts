// src/common/services/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'forum' },
                (error, result) => {
                    if (error || !result) return reject(error || new Error('Lỗi upload'));
                    resolve(result);
                }
            ).end(file.buffer);
        });
    }
}
