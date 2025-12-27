import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';

const hasCloudinaryConfig = Boolean(
    env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret,
);

if (hasCloudinaryConfig) {
    cloudinary.config({
        cloud_name: env.cloudinary.cloudName,
        api_key: env.cloudinary.apiKey,
        api_secret: env.cloudinary.apiSecret,
    });
}

const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const getBaseUrl = () => env.baseUrl.replace(/\/$/, '');

const moveToLocalStorage = (localFilePath, resourceType = 'auto') => {
    const extension = path.extname(localFilePath) || '';
    const safeExtension = extension.replace('.', '');
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    const destination = path.join(uploadsDir, fileName);
    fs.renameSync(localFilePath, destination);
    const stats = fs.statSync(destination);
    return {
        secureUrl: `${getBaseUrl()}/uploads/${fileName}`,
        publicId: `local:${fileName}`,
        bytes: stats.size,
        format: safeExtension,
        pages: undefined,
        resourceType,
        isLocal: true,
    };
};

export const uploadOnCloudinary = async (localFilePath, options = {}) => {
    if (!localFilePath) return null;
    const resourceType = options.resourceType || 'auto';

    if (!hasCloudinaryConfig) {
        return moveToLocalStorage(localFilePath, resourceType);
    }

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            secure: true,
            folder: options.folder || 'notess/resources',
            resource_type: resourceType,
        });
        fs.unlinkSync(localFilePath);
        return {
            secureUrl: response.secure_url,
            publicId: response.public_id,
            bytes: response.bytes,
            format: response.format,
            pages: response.pages,
            resourceType: response.resource_type,
        };
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        throw error;
    }
};

export const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
    if (!publicId) return;
    if (publicId.startsWith('local:')) {
        const fileName = publicId.replace('local:', '');
        const filePath = path.join(uploadsDir, fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return;
    }
    if (!hasCloudinaryConfig) return;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

