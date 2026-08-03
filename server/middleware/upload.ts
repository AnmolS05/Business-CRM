import multer from 'multer';

/**
 * Configure Multer middleware to store uploaded files in memory with a 15MB file size restriction.
 */
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});
