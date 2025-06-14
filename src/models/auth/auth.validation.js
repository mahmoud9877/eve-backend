import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
export const signup = joi
  .object({
    email: generalFields.email,
    password: generalFields.password,
  })
  .required();

export const token = joi
  .object({
    token: generalFields.email,
  })
  .required();

export const login = joi
  .object({
    email: generalFields.email,
    password: generalFields.password,
  })
  .required();

// export const sendCode = joi
//   .object({
//     email: generalFields.email,
//   })
//   .required();

// export const forgetPassword = joi
//   .object({
//     email: generalFields.email,
//     password: generalFields.password,
//     code: joi
//       .string()
//       .pattern(new RegExp(/^\d{4}$/))
//       .required(),
//   })
//   .required();
