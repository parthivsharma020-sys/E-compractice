import express, { type Express } from "express";
import { type Request, type Response, type NextFunction } from "express";
import { Order } from "../entities/Order.js";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";

export const getOrders = (req: Request, res: Response, next: NextFunction) => {
      const orders = Order.find({ where: { id: Number(req.params.userId) } });
    return res.json(orders);
    next();
}
