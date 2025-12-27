import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import s3 from "../config/s3.js";
import dotenv from "dotenv";
dotenv.config(); 

const restaurantProfileUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_RESTAURANT_PROFILE_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `profile/${uuidv4()}.${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB (profile pic)
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"), false);
    }
    cb(null, true);
  },
});

export default restaurantProfileUpload;
