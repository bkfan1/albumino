import { regex } from "@/utils/regex";

const Joi = require("joi");

export const accountSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().min(8).required(),

  firstname: Joi.string().pattern(regex.firstname).required(),

  lastname: Joi.string().pattern(regex.lastname).required(),
});
