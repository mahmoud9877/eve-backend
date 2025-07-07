import Joi from "joi";

export const chatMessageSchema = Joi.object({
  employeeId: Joi.number().required(),
  message: Joi.string().allow("", null),
});
