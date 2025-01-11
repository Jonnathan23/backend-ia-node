import { Storage } from '@google-cloud/storage';
import path from 'path';

// Configurar Google Cloud Storage
const storage = new Storage({
  credentials: {
    type: process.env.type || '',
    project_id: process.env.project_id || '',
    private_key_id: process.env.private_key_id || '',
    private_key: (process.env.private_key || '').replace(/\\n/g, '\n'), // Escapar saltos de línea
    client_email: process.env.client_email || '',
    client_id: process.env.client_id || '',
  },
  projectId: process.env.PROJECT_ID,
});

const bucketName = 'backend_images_ia';
const bucket = storage.bucket(bucketName);

/**
 * Sube un archivo a Google Cloud Storage
 * @param file - El archivo desde multer
 * @returns URL pública del archivo
 */
export const uploadImageToGoogleCloud = async (file: Express.Multer.File): Promise<string> => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const blob = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream
      .on('finish', () => {
        // Construir la URL pública directamente
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        resolve(publicUrl);
      })
      .on('error', (err) => reject(`Error al subir archivo: ${err.message}`))
      .end(file.buffer);
  });
};

