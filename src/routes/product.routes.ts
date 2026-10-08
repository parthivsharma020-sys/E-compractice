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

import wrapAsync from "../utils/wrapAsync.js";

Router.get("/", wrapAsync(getAllProducts));

Router.post(
  "/creates",
  isLoggedIn,
  authorizeRoles("admin", "manager"),
  wrapAsync(createProduct),
);

Router.delete(
  "/:id",
  isLoggedIn,
  authorizeRoles(UserRole.ADMIN),
  wrapAsync(deleteProduct),
);

Router.post(
  "/:id",
  isLoggedIn,
  authorizeRoles(UserRole.ADMIN, UserRole.MANAGER),
  wrapAsync(updateProduct),
);

export default Router;
