import multer from 'multer';

// Configuración de almacenamiento en memoria para multer
const storage = multer.memoryStorage();
export const upload = multer({ storage });
