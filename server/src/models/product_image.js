const { DataTypes } = require("sequelize");

const { sequelize } = require("../configs/database");
const Product_Variant = require("./product_variant");

const Product_Image = sequelize.define(
  "Product_Image",
  {
    image_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public_id: {
      type: DataTypes.STRING, // Cloudinary public ID
      allowNull: true,
    },
  },
  {
    tableName: "product_images",
    timestamps: false,
  }
);

// Associations
Product_Variant.hasMany(Product_Image, {
  foreignKey: {
    name: "product_variant_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Product_Image.belongsTo(Product_Variant, {
  foreignKey: {
    name: "product_variant_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Product_Image;
