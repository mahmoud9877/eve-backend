import { Op } from "sequelize";
import { asyncHandler } from "../../utils/errorHandling.js";
import Employee from "../../../DataBase/model/Employee.model.js";

export const getAllEveEmployee = asyncHandler(async (req, res) => {
  const employees = await Employee.findAll();
  return res.status(200).json({ message: "Done", employees });
});

export const searchEveEmployee = asyncHandler(async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name is required for search" });
  }

  const searchResults = await Employee.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`, // يسمح بالبحث الجزئي
      },
      createdBy: req.user.id, // يعرض فقط سجلات المستخدم الحالي
    },
  });

  return res.status(200).json({ message: "Done", searchResults });
});

export const createEveEmployee = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // const existingEmployee = await Employee.findOne({
  //   where: { createdBy: user.id },
  // });
  // if (existingEmployee) {
  //   return res.status(400).json({
  //     message: "This user already has an employee assigned.",
  //   });
  // }

  const { name, department, introduction, position } = req.body;

  if (!name || !department || !introduction) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const eveEmployee = await Employee.create({
    name,
    department,
    introduction,
    position,
    createdBy: user.id,
  });

  return res.status(201).json({ message: "Done", eveEmployee });
});

export const updateEveEmployee = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { name, department_office, role, status } = req.body;
  console.log(name, department_office, role, status);
  const eveEmployee = await Employee.findOne({
    where: { createdBy: user.id },
  });

  if (!eveEmployee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  eveEmployee.name = name;
  eveEmployee.department_office = department_office;
  eveEmployee.role = role;
  eveEmployee.status = status;
  await eveEmployee.save();
  return res.status(200).json({ message: "Done", eveEmployee });
});

export const getMyEveEmployee = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const eveEmployee = await Employee.findAll({
    where: { createdBy: user.id },
  });
  if (!eveEmployee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  return res.status(200).json({ message: "Done", eveEmployee });
});
