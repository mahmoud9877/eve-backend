import { asyncHandler } from "../../utils/errorHandling.js";
import Employee from "../../../DataBase/model/Employee.model.js";

export const getAllEveEmployee = asyncHandler(async (req, res) => {
  const employees = await Employee.findAll();
  return res.status(200).json({ message: "Done", employees });
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  console.log("sssssssssssssssssssssss", id);
  const oneEmployee = await Employee.findOne({
    where: {
      id: id,
    },
  });
  if (!oneEmployee) {
    return res.status(404).json({ message: "Employee not found" });
  }
  return res.status(200).json({ message: "Done", oneEmployee });
});

export const createEveEmployee = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, department, introduction, position } = req.body;

  if (!name || !department || !introduction || !position) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let photoUrl = null;
  if (req.file) {
    photoUrl = `/uploads/${req.file.filename}`;
  }

  const knowledgeText = `مرحباً، أنا ${name}. أعمل في قسم ${department} بمنصب ${position}. نبذة عني: ${introduction}`;

  const eveEmployee = await Employee.create({
    name,
    department,
    introduction,
    position,
    photoUrl,
    createdBy: user.id,
    knowledgeText, // ← نضيفها هنا
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
  });

  if (!employees || employees.length === 0) {
    return res.status(200).json({ message: "Done", employees });
  }

  return res.status(200).json({ message: "Done", employees });
});
