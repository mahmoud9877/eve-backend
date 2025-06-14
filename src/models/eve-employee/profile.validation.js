import Joi from "joi";
// import { generalFields } from "../../middleware/validation.js";
export const createEveEmployee = Joi.object({
  name: Joi.string().min(2).max(25).required(),
  department: Joi.string().min(2).max(25).required(),
  gender: Joi.string().min(2).max(25).required(),
  introduction: Joi.string().min(2).max(25).required(),
}).required();
