import express, { type Express } from "express";
const Router = express.Router();
import { UserRole } from "../entities/User.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/isLoggedIn.js";
import { Product } from "../entities/Product.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { type Request, type Response, type NextFunction } from "express";
import wrapAsync from "../utils/wrapAsync.js";

Router.get("/", wrapAsync(getAllProducts));

Router.post(
  "/products/create-product",
  isLoggedIn,
  authorizeRoles("admin", "manager"),
  wrapAsync(createProduct),
);

Router.post(
  "/products/:id/delete",
  isLoggedIn,
  authorizeRoles(UserRole.ADMIN),
  wrapAsync(deleteProduct),
);

Router.post(
  "/products/:id/updates",
  isLoggedIn,
  authorizeRoles(UserRole.ADMIN, UserRole.MANAGER),
 wrapAsync(updateProduct)
);

export default Router;
