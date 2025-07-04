const { DataTypes } = require("sequelize");

const { sequelize } = require("../configs/database");
const Role = require("./role");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verify_token: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

Role.hasMany(User, {
  foreignKey: { name: "role_id", type: DataTypes.INTEGER, allowNull: false },
});
User.belongsTo(Role, {
  foreignKey: { name: "role_id", type: DataTypes.INTEGER, allowNull: false },
});

module.exports = User;
