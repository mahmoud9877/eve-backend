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
        "Engineering",
        "Marketing",
        "Sales",
        "Human Resources",
        "General Employee"
      ),
      allowNull: false,
      defaultValue: "General Employee",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "visitor",
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "General Employee",
    },
    knowledgeText: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department_office: {
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
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("online", "away", "busy", "in meeting"),
      defaultValue: "online",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // unique: true, // ✅ ده اللي هيمنع تكرار اليوزر
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
