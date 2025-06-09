const { DataTypes } = require("sequelize");

const { sequelize } = require("../configs/database");

const Colour = sequelize.define(
  "Colour",
  {
    colour_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    colour_name: DataTypes.STRING,
  },
  {
    tableName: "colours",
    timestamps: false,
  }
);

module.exports = Colour;
