import express, {
  type Response,
  type Request,
  type NextFunction,
} from "express";
import {
  addToOrder,
  cancelOrder,
  getOrders,
} from "../controllers/order.controller.js";
import wrapAsync from "../utils/wrapAsync.js";
const Router = express.Router();
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

Router.get("/:userId", isLoggedIn, wrapAsync(getOrders));

Router.post("/:userId", isLoggedIn, wrapAsync(addToOrder));

Router.delete("/:userId", isLoggedIn, wrapAsync(cancelOrder));

export default Router;
