const Joi = require("joi");

const albumSchema = Joi.object({
  author_account_id: Joi.string().optional(),

  contributors: Joi.array().required(),

  name: Joi.string().required(),
  description: Joi.string().required(),

  updated_at: Joi.date().required(),

  created_at: Joi.date().required(),
});

export default albumSchema;
