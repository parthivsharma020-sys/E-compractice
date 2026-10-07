import express, { type Express } from "express";
const Router = express.Router();
import { UserRole } from "../entities/User.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/isLoggedIn.js";
import { Product } from "../entities/Product.js";
import {
  createProduct,
  getAllProducts,
} from "../controllers/product.controller.js";
// import {isLoggedIn} from "../middlewares/isLoggedIn.js";
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
  authorizeRoles("admin"),
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const product = await Product.delete({ id });

    return res.json(product);
  },
);

Router.post(
  "/products/:id/delete",
  isLoggedIn,
  authorizeRoles(UserRole.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const product = await Product.delete({ id });

    return res.json(product);
  },
);

Router.post(
  "/products/:id/updates",
  isLoggedIn,
  authorizeRoles(UserRole.ADMIN, UserRole.MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

export default Router;
