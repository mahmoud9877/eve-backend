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
    gender: {
      type: DataTypes.ENUM("male", "female"),
      defaultValue: "male",
    },
    role: {
      type: DataTypes.ENUM("User", "Admin"),
      defaultValue: "User",
    },
    photoUrl: {
      type: DataTypes.STRING,
      defaultValue: "https://placehold.co/200x200?text=User&font=roboto",
    },
    changePasswordTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("online", "away", "busy", "in meeting"),
      defaultValue: "online",
    },
  },
  {
    timestamps: true,
  }
);


export default User;
