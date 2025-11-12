import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  company: Joi.string().allow("", null).max(200),
  email: Joi.string().email().required(),
  phone: Joi.string().allow("", null).max(50),
  country: Joi.string().allow("", null).max(100),
  comment: Joi.string().allow("", null).max(2000),
  recaptchaToken: Joi.string().required(),
});

export const validateContact = (payload: any) =>
  schema.validate(payload, { abortEarly: false });
