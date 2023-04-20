const Joi = require("joi");

const photoSchema = Joi.object({
  author_account_id: Joi.string().required(),
  album_id: Joi.string().optional(),

  filename: Joi.string().required(),
  url: Joi.string().required(),

  uploaded_at: Joi.date().required(),
});

export default photoSchema;
