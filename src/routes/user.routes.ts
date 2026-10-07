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
import { addToCart } from "../controllers/cart.controller.js";
import { addToOrder, usersCart } from "../controllers/order.controller.js";

Router.get("/users", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
});

Router.post("/register", wrapAsync(registerUser));

Router.post("/login", wrapAsync(loginUser));

Router.post("/logout", isLoggedIn, wrapAsync(logoutUser));
Router.post("/updates", isLoggedIn, wrapAsync(updateUser));

Router.post("/delete", isLoggedIn, wrapAsync(deleteUser));

Router.post("/:userId/cart", isLoggedIn, wrapAsync(addToCart));

Router.post("/:userId/orders", isLoggedIn, wrapAsync(addToOrder));

Router.get("/:userId/cart", isLoggedIn, wrapAsync(usersCart));

// Router.delete("/:userId/orders", isLoggedIn,wrapAsync(cancelOrder));
// Router.post(
//   "/:id/delete",isLoggedIn,
//   async (req: Request, res: Response, next: NextFunction) => {
//     const id = Number(req.params.id);
//     const user = await User.find({ where: { id } });
//     return res.json(user);
//   },
// );

export default Router;
