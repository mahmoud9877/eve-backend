// validation/chat.schema.ts

import Joi from "joi";

export const chatMessageSchema = Joi.object({
  message: Joi.string().allow("", null), // اختياري في حالة وجود ملف فقط
});
