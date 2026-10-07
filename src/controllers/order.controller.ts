import express, { type Express } from "express";
import { type Request, type Response, type NextFunction } from "express";
import { Order } from "../entities/Order.js";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";
import { ExpressError } from "../utils/ExpressError.js";

export const getOrders = (req: Request, res: Response, next: NextFunction) => {
  const orders = Order.find({ where: { id: Number(req.params.userId) } });
  if (!orders) {
    throw new ExpressError(204, "order not found");
  }
    return res.json(orders);
    next();
}
