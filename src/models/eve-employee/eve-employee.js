import { asyncHandler } from "../../utils/errorHandling.js";
import Employee from "../../../DataBase/model/Employee.model.js";

export const getAllEveEmployee = asyncHandler(async (req, res) => {
  const employees = await Employee.findAll();
  return res.status(200).json({ message: "Done", employees });
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const oneEmployee = await Employee.findOne({
    where: { id },
    attributes: [
      "id",
      "name",
      "department",
      // "introduction",
      "photoUrl",
      "status",
    ],
  });

  if (!oneEmployee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  return res.status(200).json(oneEmployee);
});

export const createEveEmployee = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { name, department, introduction } = req.body;
  if (!name || !department || !introduction) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  let photoUrl = null;
  if (req.file) {
    photoUrl = `/uploads/${req.file.filename}`;
  }
  const knowledgeText = `Hello, I'm ${name}. I work in the ${department}. About me: ${introduction}`;
  const eveEmployee = await Employee.create({
    name,
    department,
    introduction,
    photoUrl,
    createdBy: user.id,
    knowledgeText,
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
  console.log(user.id);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const employees = await Employee.findAll({
    where: {
      createdBy: user.id,
    },
    attributes: [
      "id",
      "name",
      "department",
      // "introduction",
      "photoUrl",
      "status",
    ],
  });
  if (!employees || employees.length === 0) {
    return res.status(200).json({ message: "Done", employees });
  }
  return res.status(200).json({ message: "Done", employees });
});
