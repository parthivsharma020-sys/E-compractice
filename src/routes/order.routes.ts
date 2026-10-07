import express, {
  type Response,
  type Request,
  type NextFunction,
} from "express";
import { getOrders } from "../controllers/order.controller.js";
import wrapAsync from "../utils/wrapAsync.js"
const Router = express.Router();
import { Order } from "../entities/Order.js";
// import jwt from "jsonwebtoken";
import { User } from "../entities/User.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


Router.get("/:userId/orders", isLoggedIn ,wrapAsync(getOrders));



export default Router;
