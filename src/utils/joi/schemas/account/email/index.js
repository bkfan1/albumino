const Joi = require("joi");

export const updateAccountEmailSchema = Joi.object({
  oldEmail: Joi.string().email().required(),
  newEmail: Joi.string().email().required(),
  confirmNewEmail: Joi.string()
    .email()
    .valid(Joi.ref("newEmail"))
    .required()
    .error(new Error("New email and confirm new email must match")),
});
