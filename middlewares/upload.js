import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import s3 from "../config/s3.js";
import dotenv from "dotenv";
dotenv.config(); 

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_PRODUCT_BUCKET,
    // acl: "public-read", // or private if using signed URLs 
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileExt = file.originalname.split(".").pop();
      const fileName = `products/${uuidv4()}.${fileExt}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
