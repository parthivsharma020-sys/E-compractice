import express, { type Express } from "express";
import { type Request, type Response, type NextFunction } from "express";
import { Order } from "../entities/Order.js";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";
import { ExpressError } from "../utils/ExpressError.js";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const products = await Product.find();
  if (!products) {
    throw new ExpressError(204, "not content availabel");
  }
  console.log(...products);
  res.status(200).json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  let { name, price, stock, Description, colors, category, discount } =
    req.body;
  if (!name || !price || !stock || !Description) {
    throw new ExpressError(400, "provide all field");
    return res.json("fill the required field..");
  }

  const created_product = await Product.create({
    name,
    price,
    stock,
    Description,
    colors,
    category,
    discount,
  }).save();

  return res.json(created_product);
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
