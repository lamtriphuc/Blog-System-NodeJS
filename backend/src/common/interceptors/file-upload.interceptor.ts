// src/common/interceptors/file-upload.interceptor.ts
import { diskStorage } from 'multer';
import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Injectable()
export class ImageUploadInterceptor extends FileInterceptor('images', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(new Error('Only image files are allowed!'), false);
        } else {
            cb(null, true);
        }
    },
}) { }
