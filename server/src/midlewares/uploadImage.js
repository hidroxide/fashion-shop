const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary");

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
