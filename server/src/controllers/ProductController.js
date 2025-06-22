const { Op } = require("sequelize");

const Product_Variant = require("../models/product_variant");
const Product = require("../models/product");
const Colour = require("../models/colour");
const Size = require("../models/size");
const Product_Price_History = require("../models/product_price_history");
const Product_Image = require("../models/product_image");
const Category = require("../models/category");

let create = async (req, res, next) => {
  let product_name = req.body.product_name;
  if (product_name === undefined)
    return res.status(400).send("Trường product_name không tồn tại");
  let category_id = req.body.category_id;
  if (category_id === undefined)
    return res.status(400).send("Trường category_id không tồn tại");
  let price = parseInt(req.body.price);
  if (price === undefined)
    return res.status(400).send("Trường price không tồn tại");
  let description = req.body.description;
  if (description === undefined)
    return res.status(400).send("Trường description không tồn tại");

  try {
    let newProduct = await Product.create({
      product_name,
      description,
      category_id,
    });
    let newProductPriceHistory = await Product_Price_History.create({
      product_id: newProduct.product_id,
      price: price,
    });
    return res.send(newProduct);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

let update = async (req, res, next) => {
  let product_id = req.body.product_id;
  if (product_id === undefined)
    return res.status(400).send("Trường product_id không tồn tại");
  let product_name = req.body.product_name;
  if (product_name === undefined)
    return res.status(400).send("Trường product_name không tồn tại");
  let category_id = req.body.category_id;
  if (category_id === undefined)
    return res.status(400).send("Trường category_id không tồn tại");
  let price = parseInt(req.body.price);
  if (price === undefined)
    return res.status(400).send("Trường price không tồn tại");
  let description = req.body.description;
  if (description === undefined)
    return res.status(400).send("Trường description không tồn tại");
  try {
    let category = await Category.findOne({ where: { category_id } });
    if (category == null)
      return res.status(400).send("Danh mục này không tồn tại");
    let product = await Product.findOne({ where: { product_id } });
    if (product == null)
      return res.status(400).send("Sản phẩm này không tồn tại");

    await Product_Price_History.create({ product_id, price });
    await product.update({ product_name, category_id, description });

    return res.send("Success");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tạo đơn hàng vui lòng thử lại");
  }
};

let listAdminSide = async (req, res, next) => {
  let listProductVariant = await Product_Variant.findAll({
    attributes: ["product_variant_id", "quantity", "state", "created_at"],
    include: [
      {
        model: Product,
        attributes: ["product_id", "product_name"],
        include: {
          model: Product_Price_History,
          attributes: ["price"],
          separate: true,
          order: [["created_at", "DESC"]],
        },
      },
      { model: Colour, attributes: ["colour_name"] },
      { model: Size, attributes: ["size_name"] },
      { model: Product_Image, attributes: ["path"] },
    ],
    order: [["created_at", "DESC"]],
  });
  listProductVariant = listProductVariant.map((productVariant) => {
    let newProductVariant = {
      product_id: productVariant.Product.product_id,
      product_variant_id: productVariant.product_variant_id,
      product_name: productVariant.Product.product_name,
      colour_name: productVariant.Colour.colour_name,
      size_name: productVariant.Size.size_name,
      product_image: productVariant.Product_Images[0].path,
      price: productVariant.Product.Product_Price_Histories[0].price,
      quantity: productVariant.quantity,
      state: productVariant.state,
      created_at: productVariant.created_at,
    };
    return newProductVariant;
  });
  return res.send(listProductVariant);
};

const listCustomerSide = async (req, res, next) => {
  const keyword = req.query.search;
  const sort = req.query.sort;
  const category_id = Number(req.query.category);
  const whereClause = {};

  const andConditions = [];

  if (!isNaN(category_id) && Number.isInteger(category_id)) {
    andConditions.push({ category_id: category_id });
  }

  if (keyword) {
    andConditions.push({
      product_name: {
        [Op.like]: `%${keyword}%`,
      },
    });
  }

  if (andConditions.length > 0) {
    whereClause[Op.and] = andConditions;
  }

  try {
    const productVariants = await Product_Variant.findAll({
      attributes: ["product_variant_id", "colour_id", "product_id"],
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "product_name",
            "rating",
            "sold",
            "feedback_quantity",
            "category_id",
          ],
          where: whereClause,
          include: [
            {
              model: Product_Price_History,
              attributes: ["price"],
              separate: true,
              order: [["created_at", "DESC"]],
            },
            {
              model: Category,
              attributes: ["title"],
            },
          ],
        },
        {
          model: Colour,
          attributes: ["colour_name"],
        },
        {
          model: Size,
          attributes: ["size_name"],
        },
        {
          model: Product_Image,
          attributes: ["path"],
        },
      ],
      where: {
        state: true,
        quantity: {
          [Op.gt]: 0,
        },
      },
      raw: false,
    });

    const productMap = new Map();

    for (const variant of productVariants) {
      const product = variant.Product;
      if (!product) continue; // tránh lỗi nếu product không được include đúng

      const pid = product.product_id;

      if (!productMap.has(pid)) {
        productMap.set(pid, {
          product_id: pid,
          product_name: product.product_name,
          rating: product.rating,
          sold: product.sold,
          feedback_quantity: product.feedback_quantity,
          category_title: product.Category?.title,
          variants: [],
        });
      }

      const variantData = {
        product_variant_id: variant.product_variant_id,
        colour_id: variant.colour_id,
        colour_name: variant.Colour?.colour_name || "",
        price: product.Product_Price_Histories?.[0]?.price || 0,
        product_image: variant.Product_Images?.[0]?.path || "",
        sizes: [variant.Size?.size_name].filter(Boolean),
      };

      // Gộp các size lại nếu đã có màu đó
      const existingVariant = productMap
        .get(pid)
        .variants.find((v) => v.colour_id === variant.colour_id);

      if (existingVariant) {
        existingVariant.sizes.push(...variantData.sizes);
        existingVariant.sizes = [...new Set(existingVariant.sizes)];
      } else {
        productMap.get(pid).variants.push(variantData);
      }
    }

    let result = [...productMap.values()];

    if (sort === "asc") {
      result.sort(
        (a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
      );
    } else if (sort === "desc") {
      result.sort(
        (a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0)
      );
    }

    return res.send(result);
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
    return res
      .status(500)
      .send("Gặp lỗi khi tải dữ liệu, vui lòng thử lại sau.");
  }
};

let detailCustomerSide = async (req, res, next) => {
  let product_id = req.params.product_id;
  if (product_id === undefined)
    return res.status(400).send("Trường product_id không tồn tại");

  try {
    let productDetail = await Product.findOne({
      attributes: [
        "product_id",
        "product_name",
        "description",
        "rating",
        "sold",
        "feedback_quantity",
        "category_id",
      ],
      where: { product_id },
      include: [
        {
          model: Category,
          attributes: ["category_id", "title"],
        },
      ],
    });
    return res.send(productDetail);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
  }
};

let detailAdminSide = async (req, res, next) => {
  let product_id = req.params.product_id;
  if (product_id === undefined)
    return res.status(400).send("Trường product_id không tồn tại");

  try {
    let productDetail = await Product.findOne({
      attributes: ["product_id", "product_name", "category_id", "description"],
      include: [
        { model: Category, attributes: ["title"] },
        {
          model: Product_Price_History,
          attributes: ["price"],
          separate: true,
          order: [["created_at", "DESC"]],
        },
        {
          model: Product_Variant,
          attributes: [
            "product_variant_id",
            "colour_id",
            "size_id",
            "quantity",
          ],
          include: [
            { model: Colour, attributes: ["colour_name"] },
            { model: Size, attributes: ["size_name"] },
            { model: Product_Image, attributes: ["path"] },
          ],
        },
      ],
      where: { product_id },
    });

    if (productDetail) {
      let productVariantList = productDetail.product_variants.map(
        (productVariant) => {
          let productImages = productVariant.Product_Images.map(({ path }) => {
            return { path };
          });
          return {
            product_variant_id: productVariant.product_variant_id,
            colour_id: productVariant.colour_id,
            colour_name: productVariant.Colour.colour_name,
            size_id: productVariant.size_id,
            size_name: productVariant.Size.size_name,
            quantity: productVariant.quantity,
            product_images: productImages,
          };
        }
      );
      productDetail = {
        product_id: productDetail.product_id,
        product_name: productDetail.product_name,
        category_id: productDetail.category_id,
        category_name: productDetail.Category.title,
        price: productDetail.Product_Price_Histories[0].price,
        description: productDetail.description,
        product_variant_list: productVariantList,
      };
      return res.send(productDetail);
    } else {
      return res.status(400).send("Biến thể sản phẩm này không tồn tại");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
  }
};

let listColour = async (req, res, next) => {
  let product_id = req.params.product_id;
  if (product_id === undefined)
    return res.status(400).send("Trường product_id không tồn tại");

  try {
    let listColour = await Product_Variant.findAll({
      attributes: ["colour_id"],
      include: [{ model: Colour, attributes: ["colour_name"] }],
      where: { product_id },
      group: ["colour_id"],
    });

    listColour = listColour.map((colour) => {
      let newColour = {
        colour_id: colour.colour_id,
        colour_name: colour.Colour.colour_name,
      };
      return newColour;
    });

    return res.send(listColour);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
  }
};

let listSize = async (req, res, next) => {
  let product_id = req.params.product_id;
  if (product_id === undefined)
    return res.status(400).send("Trường product_id không tồn tại");
  let colour_id = req.params.colour_id;
  if (colour_id === undefined)
    return res.status(400).send("Trường colour_id không tồn tại");

  try {
    let listSize = await Product_Variant.findAll({
      attributes: ["size_id"],
      include: [{ model: Size, attributes: ["size_name"] }],
      where: { product_id, colour_id, state: true },
    });

    listSize = listSize.map((size) => {
      let newSize = {
        size_id: size.size_id,
        size_name: size.Size.size_name,
      };
      return newSize;
    });

    return res.send(listSize);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
  }
};

const searchCustomerSide = async (req, res, next) => {
  const category_id = Number(req.query.category);
  const searchKeyword = req.query.search;

  const productWhere = {};

  if (!isNaN(category_id) && Number.isInteger(category_id)) {
    productWhere.category_id = category_id;
  }

  if (searchKeyword && typeof searchKeyword === "string") {
    productWhere.product_name = { [Op.like]: `%${searchKeyword}%` };
  }

  try {
    const productVariants = await Product_Variant.findAll({
      attributes: ["product_variant_id", "colour_id", "product_id"],
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "product_name",
            "rating",
            "sold",
            "feedback_quantity",
            "category_id",
          ],
          where: productWhere,
          include: [
            {
              model: Product_Price_History,
              attributes: ["price"],
              separate: true,
              order: [["created_at", "DESC"]],
            },
            {
              model: Category,
              attributes: ["title"],
            },
          ],
        },
        {
          model: Colour,
          attributes: ["colour_name"],
        },
        {
          model: Size,
          attributes: ["size_name"],
        },
        {
          model: Product_Image,
          attributes: ["path"],
        },
      ],
      where: {
        state: true,
        quantity: {
          [Op.gt]: 0,
        },
      },
      raw: false,
    });

    const productMap = new Map();

    for (const variant of productVariants) {
      const product = variant.Product;
      if (!product) continue;

      const pid = product.product_id;

      if (!productMap.has(pid)) {
        productMap.set(pid, {
          product_id: pid,
          product_name: product.product_name,
          rating: product.rating,
          sold: product.sold,
          feedback_quantity: product.feedback_quantity,
          category_title: product.Category?.title || "",
          variants: [],
        });
      }

      const variantData = {
        product_variant_id: variant.product_variant_id,
        colour_id: variant.colour_id,
        colour_name: variant.Colour?.colour_name || "",
        price: product.Product_Price_Histories?.[0]?.price || 0,
        product_image: variant.Product_Images?.[0]?.path || "",
        sizes: [variant.Size?.size_name].filter(Boolean),
      };

      const existingVariant = productMap
        .get(pid)
        .variants.find((v) => v.colour_id === variant.colour_id);

      if (existingVariant) {
        existingVariant.sizes.push(...variantData.sizes);
        existingVariant.sizes = [...new Set(existingVariant.sizes)];
      } else {
        productMap.get(pid).variants.push(variantData);
      }
    }

    return res.send([...productMap.values()]);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", err);
    return res.status(500).send("Gặp lỗi khi tìm kiếm, vui lòng thử lại sau.");
  }
};

const getNewestProducts = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;

  try {
    const productVariants = await Product_Variant.findAll({
      attributes: [
        "product_variant_id",
        "product_id",
        "colour_id",
        "size_id",
        "quantity",
        "state",
      ],
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "product_name",
            "rating",
            "sold",
            "feedback_quantity",
            "category_id",
            "created_at",
          ],
          include: [
            {
              model: Product_Price_History,
              attributes: ["price"],
              separate: true,
              order: [["created_at", "DESC"]],
            },
            {
              model: Category,
              attributes: ["title"],
            },
          ],
        },
        {
          model: Colour,
          attributes: ["colour_id", "colour_name"],
        },
        {
          model: Size,
          attributes: ["size_id", "size_name"],
        },
        {
          model: Product_Image,
          attributes: ["path"],
        },
      ],
      where: {
        state: true,
        quantity: { [Op.gt]: 0 },
      },
      order: [[{ model: Product }, "created_at", "DESC"]],
    });

    const productMap = new Map();

    for (const variant of productVariants) {
      const product = variant.Product;
      if (!product) continue;

      const pid = product.product_id;

      if (!productMap.has(pid)) {
        productMap.set(pid, {
          product_id: pid,
          product_name: product.product_name,
          rating: product.rating,
          sold: product.sold,
          feedback_quantity: product.feedback_quantity,
          category_title: product.Category?.title || "",
          variants: [],
        });
      }

      const variantList = productMap.get(pid).variants;
      const existing = variantList.find(
        (v) => v.colour_id === variant.colour_id
      );

      const sizeName = variant.Size?.size_name;
      const image = variant.Product_Images?.[0]?.path || "";
      const price = product.Product_Price_Histories?.[0]?.price || 0;

      if (existing) {
        if (sizeName && !existing.sizes.includes(sizeName)) {
          existing.sizes.push(sizeName);
        }
      } else {
        variantList.push({
          product_variant_id: variant.product_variant_id,
          colour_id: variant.colour_id,
          colour_name: variant.Colour?.colour_name || "",
          price,
          product_image: image,
          sizes: sizeName ? [sizeName] : [],
        });
      }
    }

    // Lấy đúng số lượng sản phẩm limit
    const result = [...productMap.values()].slice(0, limit);

    return res.send(result);
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm mới:", err);
    return res.status(500).send("Gặp lỗi khi tải sản phẩm mới");
  }
};

const getBestSellingProducts = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;

  try {
    const productVariants = await Product_Variant.findAll({
      attributes: [
        "product_variant_id",
        "product_id",
        "colour_id",
        "size_id",
        "quantity",
        "state",
      ],
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "product_name",
            "rating",
            "sold",
            "feedback_quantity",
            "category_id",
          ],
          where: {
            sold: { [Op.gt]: 0 }, // 👉 chỉ lấy sản phẩm bán được
          },
          include: [
            {
              model: Product_Price_History,
              attributes: ["price"],
              separate: true,
              order: [["created_at", "DESC"]],
            },
            {
              model: Category,
              attributes: ["title"],
            },
          ],
        },
        {
          model: Colour,
          attributes: ["colour_id", "colour_name"],
        },
        {
          model: Size,
          attributes: ["size_id", "size_name"],
        },
        {
          model: Product_Image,
          attributes: ["path"],
        },
      ],
      where: {
        state: true,
        quantity: { [Op.gt]: 0 },
      },
      order: [[{ model: Product }, "sold", "DESC"]],
    });

    const productMap = new Map();

    for (const variant of productVariants) {
      const product = variant.Product;
      if (!product) continue;

      const pid = product.product_id;

      if (!productMap.has(pid)) {
        productMap.set(pid, {
          product_id: pid,
          product_name: product.product_name,
          rating: product.rating,
          sold: product.sold,
          feedback_quantity: product.feedback_quantity,
          category_title: product.Category?.title || "",
          variants: [],
        });
      }

      const variantList = productMap.get(pid).variants;
      const existing = variantList.find(
        (v) => v.colour_id === variant.colour_id
      );

      const sizeName = variant.Size?.size_name;
      const image = variant.Product_Images?.[0]?.path || "";
      const price = product.Product_Price_Histories?.[0]?.price || 0;

      if (existing) {
        if (sizeName && !existing.sizes.includes(sizeName)) {
          existing.sizes.push(sizeName);
        }
      } else {
        variantList.push({
          product_variant_id: variant.product_variant_id,
          colour_id: variant.colour_id,
          colour_name: variant.Colour?.colour_name || "",
          price,
          product_image: image,
          sizes: sizeName ? [sizeName] : [],
        });
      }
    }

    const result = [...productMap.values()].slice(0, limit);

    return res.send(result);
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm bán chạy:", err);
    return res.status(500).send("Gặp lỗi khi tải sản phẩm bán chạy");
  }
};

module.exports = {
  create,
  update,
  listAdminSide,
  listCustomerSide,
  detailCustomerSide,
  detailAdminSide,
  listColour,
  listSize,
  searchCustomerSide,
  getNewestProducts,
  getBestSellingProducts,
};
