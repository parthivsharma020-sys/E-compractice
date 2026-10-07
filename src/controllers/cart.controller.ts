import express, { type Express } from "express";
const Router = express.Router();
import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";
import bcrypt from "bcrypt";
import { type JwtPayload } from "jsonwebtoken";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { Order } from "../entities/Order.js";
// import "dotenv/config"
import { CartItem } from "../entities/Cart_item.js";
import { Status } from "../entities/Order.js";
import wrapAsync from "../utils/wrapAsync.js";
import {
  deleteUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import { ExpressError } from "../utils/ExpressError.js";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.userId);
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json("product id missing..");
    }
    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const product = await Product.findOne({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json("Product not found");
    }

    const CART = new CartItem();
    CART.user = user;
    CART.product = product;
    CART.quantity = Number(quantity);
    await CART.save();
    console.log(CART);
    // await user.save();

    return res.status(200).json("item added");
  } catch (err) {
    console.log("error adding to cart ", err);
    return res.status(500).json("Internal error");
  }
};
