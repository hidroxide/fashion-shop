const fs = require("fs");

const Product = require("../models/product");
const Product_Variant = require("../models/product_variant");
const Product_Image = require("../models/product_image");
const Product_Price_History = require("../models/product_price_history");
const uploadImage = require("../midlewares/uploadImage");
const cloudinary = require("../configs/cloudinary");

let create = async (req, res, next) => {
  uploadImage(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(400).send(err.message || "Lỗi upload ảnh");
    }

    const { quantity, product_id, colour_id, size_id } = req.body;

    // Chuyển đổi kiểu dữ liệu và kiểm tra hợp lệ
    const quantityNum = parseInt(quantity);
    const productIdNum = parseInt(product_id);
    const colourIdNum = parseInt(colour_id);
    const sizeIdNum = parseInt(size_id);

    if (isNaN(quantityNum))
      return res.status(400).send("Trường quantity không hợp lệ");
    if (isNaN(productIdNum))
      return res.status(400).send("Trường product_id không hợp lệ");
    if (isNaN(colourIdNum))
      return res.status(400).send("Trường colour_id không hợp lệ");
    if (isNaN(sizeIdNum))
      return res.status(400).send("Trường size_id không hợp lệ");

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("Chưa có file ảnh nào được tải lên");
    }

    try {
      // Tạo biến thể sản phẩm
      const newProductVariant = await Product_Variant.create({
        quantity: quantityNum,
        product_id: productIdNum,
        colour_id: colourIdNum,
        size_id: sizeIdNum,
      });

      // Tạo bản ghi hình ảnh (lưu cả path và public_id từ Cloudinary)
      for (const file of files) {
        await Product_Image.create({
          path: file.path, // URL trả về từ Cloudinary
          public_id: file.filename, // public_id của Cloudinary (dùng khi xóa)
          product_variant_id: newProductVariant.product_variant_id,
        });
      }

      return res.status(201).json({
        message: "Tạo biến thể sản phẩm thành công",
        product_variant: newProductVariant,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Gặp lỗi khi tải dữ liệu. Vui lòng thử lại.");
    }
  });
};

let update = async (req, res, next) => {
  uploadImage(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(400).send(err.message || "Lỗi upload ảnh");
    }

    const product_variant_id = parseInt(req.body.product_variant_id);
    const quantity = parseInt(req.body.quantity);

    if (isNaN(product_variant_id)) {
      return res.status(400).send("Trường product_variant_id không hợp lệ");
    }

    if (isNaN(quantity)) {
      return res.status(400).send("Trường quantity không hợp lệ");
    }

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("Chưa có file ảnh nào được tải lên");
    }

    try {
      const productVariant = await Product_Variant.findOne({
        where: { product_variant_id },
        include: {
          model: Product_Image,
          attributes: ["image_id", "public_id"],
        },
      });

      if (!productVariant) {
        return res.status(404).send("Product Variant này không tồn tại");
      }

      // ✅ XÓA ẢNH CŨ TỪ CLOUDINARY
      for (const img of productVariant.Product_Images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.warn(
              `Không thể xóa ảnh Cloudinary với public_id ${img.public_id}:`,
              err.message
            );
          }
        }
        await Product_Image.destroy({ where: { image_id: img.image_id } });
      }

      // ✅ THÊM ẢNH MỚI
      for (const file of files) {
        await Product_Image.create({
          path: file.path, // Cloudinary URL
          public_id: file.filename, // Cloudinary public_id
          product_variant_id,
        });
      }

      // ✅ CẬP NHẬT SỐ LƯỢNG
      await productVariant.update({ quantity });

      return res.status(200).json({
        message: "Cập nhật biến thể sản phẩm thành công!",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send("Gặp lỗi khi cập nhật dữ liệu. Vui lòng thử lại.");
    }
  });
};

let onState = async (req, res, next) => {
  try {
    let product_variant_ids = req.body.product_variant_ids;
    if (product_variant_ids === undefined)
      return res.status(400).send("Trường product_variant_ids không tồn tại");
    await Product_Variant.update(
      { state: true },
      { where: { product_variant_id: product_variant_ids } }
    );
    return res.send({ message: "Mở bán biến thể sản phẩm thành công!" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
  }
};

let offState = async (req, res, next) => {
  try {
    let product_variant_ids = req.body.product_variant_ids;
    if (product_variant_ids === undefined)
      return res.status(400).send("Trường product_variant_ids không tồn tại");
    Product_Variant.update(
      { state: false },
      { where: { product_variant_id: product_variant_ids } }
    );
    return res.send({ message: "Tắt biến thể sản phẩm thành công!" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
  }
};

let updateQuantity = async (req, res, next) => {
  try {
    let product_variant_ids = req.body.product_variant_ids;
    if (product_variant_ids === undefined)
      return res.status(400).send("Trường product_variant_ids không tồn tại");
    let newQuantity = req.body.quantity;
    if (newQuantity === undefined)
      return res.status(400).send("Trường quantity không tồn tại");

    await Product_Variant.update(
      { quantity: newQuantity },
      { where: { product_variant_id: product_variant_ids } }
    );
    return res.send({
      message: "Cập nhật tồn kho cho biến thể sản phẩm thành công!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
  }
};

let deleteProductVariant = async (req, res, next) => {
  let product_variant_ids = req.body.product_variant_ids;
  if (product_variant_ids === undefined)
    return res.status(400).send("Trường product_variant_ids không tồn tại");

  try {
    let productVariant;
    for (let product_variant_id of product_variant_ids) {
      productVariant = await Product_Variant.findOne({
        where: { product_variant_id },
      });
      if (!productVariant)
        return res.status(400).send("Product Variant này không tồn tại");
    }

    await Product_Variant.destroy({
      where: { product_variant_id: product_variant_ids },
    });

    let product_id = productVariant.product_id;
    let product = await Product.findOne({ where: { product_id } });
    let count = await product.countProduct_variants();
    if (count == 0) await product.destroy();

    return res.send({ message: "Xóa biến thể sản phẩm thành công" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
  }
};

let detailCustomerSide = async (req, res, next) => {
  let product_id = req.params.product_id;
  if (product_id === undefined)
    return res.status(400).send("Trường product_id không tồn tại");
  let colour_id = req.params.colour_id;
  if (colour_id === undefined)
    return res.status(400).send("Trường colour_id không tồn tại");
  let size_id = req.params.size_id;
  if (size_id === undefined)
    return res.status(400).send("Trường size_id không tồn tại");

  try {
    let productVariant = await Product_Variant.findOne({
      attributes: ["product_variant_id", "quantity"],
      include: [
        {
          model: Product,
          attributes: ["product_id"],
          include: {
            model: Product_Price_History,
            attributes: ["price"],
            separate: true,
            order: [["created_at", "DESC"]],
          },
        },
        { model: Product_Image, attributes: ["path"] },
      ],
      where: { product_id, colour_id, size_id, state: true },
    });

    let newProductVariant = {
      product_variant_id: productVariant.product_variant_id,
      price: productVariant.Product.Product_Price_Histories[0].price,
      quantity: productVariant.quantity,
      product_images: [],
    };

    for (let image of productVariant.Product_Images) {
      newProductVariant.product_images.push(image.path);
    }

    return res.send(newProductVariant);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
  }
};

module.exports = {
  create,
  update,
  onState,
  offState,
  updateQuantity,
  deleteProductVariant,
  detailCustomerSide,
};
