import express, {
  type Response,
  type Request,
  type NextFunction,
} from "express";
import { usersCart } from "../controllers/order.controller.js";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { addToCart } from "../controllers/cart.controller.js";

const Router = express.Router();

Router.post("/:userId", isLoggedIn, wrapAsync(addToCart));
Router.get("/:userId", isLoggedIn, wrapAsync(usersCart));

export default Router;
