import sharp from "sharp";

export const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const buffer = await sharp(req.file.buffer)
      .resize(512, 512, { fit: "inside" }) // profile pic size
      .jpeg({ quality: 70 })
      .toBuffer();

    req.file.buffer = buffer;
    req.file.mimetype = "image/jpeg";

    next();
  } catch (err) {
    console.error("Image compression error:", err);
    return res.status(400).json({ message: "Invalid image file" });
  }
};
