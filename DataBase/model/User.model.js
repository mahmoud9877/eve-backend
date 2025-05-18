import { DataTypes } from "sequelize";
import sequelize from "../connection.js";

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [2, 20],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      defaultValue: "https://placehold.co/200x200?text=User&font=roboto",
    },
    role: {
      type: DataTypes.ENUM("Admin", "User"),
      defaultValue: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default User;
