import express, { type Express } from "express";
import { type Request, type Response, type NextFunction } from "express";
import { Order } from "../entities/Order.js";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";
import { ExpressError } from "../utils/ExpressError.js";
import { ProductSchema } from "../validator/product.validator.js";
import { type productType } from "../entities/Product.js";
import { error } from "node:console";
import { skip } from "node:test";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const products = await Product.find({
    skip,
    take: limit,
    // order: {
    //   id: "DESC",
    // },
  });
  if (!products) {
    throw new ExpressError(204, "not content availabel");
  }
  
  
  res.status(200).json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  let { error, value } = ProductSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, `${error}`);
  }
  // const { name, price, stock, Description, colors, category, discount } = value;

  const products = Product.create(value);

  const savedProducts = await Product.save(products);

  return res.json(savedProducts);
};
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = Number(req.params.id);
  if (!id) {
    throw new ExpressError(404, "product not found");
  }
  const product = await Product.delete({ id });
  if (!product) {
    throw new ExpressError(500, "product not deleted");
  }

  return res.json(product);
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = Number(req.params.id);
  const { name, price, category, stock, Description, discount, colors } =
    req.body;

  const product = (await Product.findOne({ where: { id } })) as Product;
  Product.merge(product, {
    name,
    price,
    category,
    stock,
    Description,
    discount,
    colors,
  }).save();

  return res.json(product);
};
