import sharp from "sharp";
import multer from "multer";

const storage = multer.memoryStorage();
export const memoryUpload = multer({ storage });

export const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(512, 512, { fit: "inside" }) // profile pic size
      .jpeg({ quality: 70 })
      .toBuffer();

    req.file.buffer = compressedBuffer;
    req.file.mimetype = "image/jpeg";

    next();
  } catch (err) {
    next(err);
  }
};
