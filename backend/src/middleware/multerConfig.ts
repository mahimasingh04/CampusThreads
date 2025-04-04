
import multer, { DiskStorageOptions, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Define the destination and filename for uploaded files
const storageOptions: DiskStorageOptions = {
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Append a timestamp to the filename to make it unique
    cb(null, Date.now() + path.extname(file.originalname));
  },
};

// Define a file filter to allow only specific file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only images (JPEG, PNG, GIF) and videos (MP4, MOV) are allowed."));
  }
};

// Initialize Multer with the storage and file filter options
const upload = multer({
  storage: multer.diskStorage(storageOptions),
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100, // Limit file size to 100MB
  },
});

export default upload;