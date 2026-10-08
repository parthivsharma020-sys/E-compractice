import Joi from "joi";
import { Status } from "../entities/Order.js";
import { UserRole } from "../entities/User.js";

const singleProductSchema = Joi.object({
  name: Joi.string().max(200).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  Description: Joi.string().max(500).required(),
  colors: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .required(),
  category: Joi.string().required(),
  discount: Joi.number().min(0).optional(),
});

export const ProductSchema = Joi.array()
  .items(singleProductSchema)
  .min(1)
  .max(100)
  .required();

export const userSchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(200).required(),
  last_name: Joi.string().trim().min(2).max(50).required(),
  password: Joi.string().min(6).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  phone_number: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .optional(),
  address: Joi.string().trim().max(255).optional(),
  role: Joi.string()
    .trim()
    .required()
    .valid(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
    .default(UserRole.USER),
});
