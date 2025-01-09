import { Storage } from '@google-cloud/storage';
import path from 'path';

// Configurar Google Cloud Storage
const storage = new Storage({
  keyFilename: 'path/to/your-service-account-file.json',
  projectId: 'your-project-id',
});

const bucketName = 'your-bucket-name';
const bucket = storage.bucket(bucketName);

/**
 * Sube un archivo a Google Cloud Storage
 * @param file - El archivo desde multer
 * @returns URL pública del archivo
 */
export const uploadImageToGoogleCloud = async (file: Express.Multer.File): Promise<string> => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream
      .on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        resolve(publicUrl);
      })
      .on('error', (err) => {
        reject(`Error subiendo archivo a Google Cloud: ${err.message}`);
      })
      .end(file.buffer);
  });
};
