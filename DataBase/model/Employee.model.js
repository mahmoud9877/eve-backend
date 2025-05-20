import { DataTypes } from "sequelize";
import sequelize from "../connection.js";

const Employee = sequelize.define(
  "EveEmployee",
  {
    name: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [2, 20],
      },
    },
    department: {
      type: DataTypes.ENUM(
        "CF PS HR MFG & Purchases",
        "CF PS MFG EGYPT",
        "F&A",
        "FPWH",
        "General Operations",
        "GMDSO",
        "HR",
        "HS&E",
        "IWS",
        "Line-1",
        "Line-10",
        "Line-2",
        "Line-9",
        "P&E CFS ENG",
        "P&E Cairo/Karachi",
        "PFSS",
        "QA",
        "Regional GMDSO",
        "Regional Tech Pack",
        "RPM WH",
        "Shave Care Operations",
        "Shave Care Qualilty",
        "Storeroom",
        "TSG Matrix",
        "TSM",
        "Utilities"
      ),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      defaultValue: "male",
    },
    photoUrl: {
      type: DataTypes.STRING,
      defaultValue: "https://placehold.co/200x200?text=User&font=roboto",
    },
    status: {
      type: DataTypes.ENUM("online", "away", "busy", "in meeting"),
      defaultValue: "online",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

export default Employee;
