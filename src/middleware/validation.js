import joi from "joi";

export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  id: joi.number().integer().positive().required(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
};

export const validation = (schema, source = ["body", "params", "query"]) => {
  return (req, res, next) => {
    let inputsData = {};

    source.forEach((key) => {
      if (key === "file" && req.file) {
        inputsData.file = req.file;
      } else if (req[key]) {
        inputsData = { ...inputsData, ...req[key] };
      }
    });

    const validationResult = schema.validate(inputsData, { abortEarly: false });

    if (validationResult.error) {
      return res.status(400).json({
        message: "validationErr",
        validationErr: validationResult.error.details,
      });
    }

    return next();
  };
};
