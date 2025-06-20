const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // ví dụ: "your_cloud_name"
  api_key: process.env.CLOUDINARY_API_KEY, // ví dụ: "1234567890"
  api_secret: process.env.CLOUDINARY_API_SECRET, // ví dụ: "abcdefg123456"
});

// Cấu hình storage sử dụng Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Tên thư mục trong Cloudinary
    format: async (req, file) => {
      // Format file (chỉ cho phép jpg, png)
      if (file.mimetype === "image/png") return "png";
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg")
        return "jpg";
      return "jpg";
    },
    public_id: (req, file) => uuidv4(), // Tên file duy nhất
  },
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid mime type. Only PNG and JPG are allowed."), false);
  }
};

// Multer middleware
const upload = multer({ storage, fileFilter });

// Cho phép upload nhiều hình (tối đa 6)
const uploadImage = upload.array("product_images", 6);

module.exports = uploadImage;
