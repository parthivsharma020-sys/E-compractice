import express, { type Express } from "express";
const Router = express.Router();
import { type Request, type Response, type NextFunction } from "express";

import { Product } from "../entities/Product.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/isLoggedIn.js";
import wrapAsync from "../utils/wrapAsync.js";
import {
  deleteUser,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import { ExpressError } from "../utils/ExpressError.js";
import { addToCart } from "../controllers/cart.controller.js";
import {
  addToOrder,
  cancelOrder,
  usersCart,
} from "../controllers/order.controller.js";
import { UserRole } from "../entities/User.js";

Router.get("/", async (req: Request, res: Response) => {
  const products = await Product.find();
  const safeProducts = products.map((p) => ({
    name: p.name,
    price: p.price,
    category: p.category,
    Description: p.Description,
  }));

  res.json(safeProducts);
});
Router.get(
  "/get-users",
  isLoggedIn,
  authorizeRoles(UserRole.ADMIN, UserRole.MANAGER),
  wrapAsync(getAllUsers),
); 

 Router.post("/register", wrapAsync(registerUser));

Router.post("/login", wrapAsync(loginUser));

Router.post("/logout", isLoggedIn, wrapAsync(logoutUser));
Router.post("/updates", isLoggedIn, wrapAsync(updateUser));

Router.delete("/:userId", isLoggedIn, wrapAsync(deleteUser));

// Router.post("/:userId/carts", isLoggedIn, wrapAsync(addToCart));
// Router.get("/:userId/carts", isLoggedIn, wrapAsync(usersCart));

// Router.post("/:userId/orders", isLoggedIn, wrapAsync(addToOrder));

// Router.delete("/:userId/orders", isLoggedIn,wrapAsync(cancelOrder));

export default Router;
