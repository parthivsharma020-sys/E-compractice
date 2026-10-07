import express, { type Express } from "express";
import { type Request, type Response, type NextFunction } from "express";
import { Order } from "../entities/Order.js";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";


export const getAllProducts =  async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.find();
  console.log(...products);
  res.status(200).json(products);
}

export const createProduct=async (req: Request, res: Response) => {
    let { name, price, stock, Description, colors, category, discount } =
      req.body;
    if (!name || !price || !stock || !Description) {
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
  }