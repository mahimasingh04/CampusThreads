import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

export function uploadBuffer(buffer: Buffer, resourceType: 'image' | 'video') {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (err, result) => {
        if (err || !result) return reject(err || new Error('Upload failed'));
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
