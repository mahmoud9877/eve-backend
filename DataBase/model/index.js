import User from "./User.model.js";
import sequelize from "../connection.js";
import Employee from "./Employee.model.js";

// Define associations
User.hasMany(Employee, {
  foreignKey: "createdBy",
  as: "employees",
});

Employee.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

export { sequelize, User, Employee };
