import Joi from "joi";

export const singleProductSchema = Joi.object({
  name: Joi.string().max(200).required,
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  Description: Joi.string().max(500).required(),
  colors: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
        .required(),
    category: Joi.string().required(),
    discount:Joi.number().min(0).optional()
  
});