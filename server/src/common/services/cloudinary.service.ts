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

    async deleteImage(publicId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error);
                if (result.result !== 'ok' && result.result !== 'not found') {
                    return reject(new Error(`Xóa ảnh thất bại: ${result.result}`));
                }
                resolve();
            });
        });
    }

    getPublicId(imageUrl: string): string | null {
        // Ví dụ: https://res.cloudinary.com/demo/image/upload/v1691167231/forum/abcxyz.jpg
        // Trích publicId: forum/abcxyz (bỏ phần mở rộng)
        try {
            const parts = imageUrl.split('/');
            const fileNameWithExtension = parts[parts.length - 1];
            const fileName = fileNameWithExtension.split('.')[0]; // "abcxyz"
            const folder = parts[parts.length - 2]; // "forum"
            return `${folder}/${fileName}`; // "forum/abcxyz"
        } catch {
            return null;
        }
    }
}
