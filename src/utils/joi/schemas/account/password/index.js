const Joi = require("joi");

export const passwordSchema = Joi.string().min(8).required();

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .error(new Error("New password and confirm new password must match")),
});
