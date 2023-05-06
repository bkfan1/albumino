const Joi = require("joi");
const albumSchema = Joi.object({
  contributors: Joi.array().required(),

  name: Joi.string().required(),
  description: Joi.string().required().min(0).max(256),

  created_at: Joi.date().required(),
  updated_at: Joi.date().required(),
});

export default albumSchema;
