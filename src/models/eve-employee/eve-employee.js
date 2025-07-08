import { asyncHandler } from "../../utils/errorHandling.js";
import Employee from "../../../DataBase/model/Employee.model.js";

export const getAllEveEmployee = asyncHandler(async (req, res) => {
  const getEmployees = await Employee.findAll();
  const employees = getEmployees.map((emp) => {
    const { knowledgeText, updatedAt, createdAt, ...rest } = emp.toJSON();
    return rest;
  });
  return res.status(200).json({ employees });
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
  const { knowledgeText, ...employeeDataWithoutKnowledge } = oneEmployee.toJSON();
  return res.status(200).json(employeeDataWithoutKnowledge);
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
  const { id } = req.params;

  const checkEmployee = await Employee.findOne({ where: { id } });
  if (!checkEmployee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const { name, department, role, status } = req.body;

  if (name !== undefined) checkEmployee.name = name;
  if (department !== undefined) checkEmployee.department = department;
  if (role !== undefined) checkEmployee.role = role;
  if (status !== undefined) checkEmployee.status = status;

  await checkEmployee.save();

  const { knowledgeText, createdAt, updatedAt, ...employeeDataWithoutKnowledge } = checkEmployee.toJSON();
  return res.status(200).json(employeeDataWithoutKnowledge);
});




export const getMyEveEmployee = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user || !user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const employees = await Employee.findAll({
    where: {
      createdBy: user.id,
    },
    attributes: ["id", "name", "department", "photoUrl", "status"],
  });

  return res.status(200).json({
    message: "Done",
    employees: employees || [],
  });
});
