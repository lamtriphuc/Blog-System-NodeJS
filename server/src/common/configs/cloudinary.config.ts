// src/common/config/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';

export function configureCloudinary() {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export default cloudinary;
