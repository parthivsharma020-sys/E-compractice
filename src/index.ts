import "reflect-metadata";
import "dotenv/config";
import { type Request, type Response, type NextFunction } from "express";
import express, { type Express } from "express";
import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Order } from "./entities/Order.js";
import { Product } from "./entities/Product.js";
import cartRouter from "./routes/cart.routes.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";
import productRouter from "./routes/product.routes.js";
import { CartItem } from "./entities/Cart_item.js";

import cookieParser from "cookie-parser";

import { ExpressError } from "./utils/ExpressError.js";
import { OrderItem } from "./entities/Order_item.js";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = Number(process.env.NODE_ENV_PORT || 54332);
const password = String(process.env.NODE_ENV_PASS || 1234);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  port: port,
  password: password,
  database: "Ecom",
  entities: [User, Order, Product, CartItem, OrderItem],
  synchronize: true,
});
const main = async () => {
  try {
    await AppDataSource.initialize();
    console.log(`connection On ${process.env.NODE_ENV_PORT}`);

    app.use("/api/users", userRouter);
    app.use("/api/orders", orderRouter);
    app.use("/api/carts", cartRouter);
    app.use("/api/products", productRouter);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      let { statusCode = 500, message = "something went wrong" } =
        err as ExpressError;

      res.status(statusCode).send(message);
    });
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.log("LOOK HERE FOR ERR-", error);
  }
};
main();

// const app: Express = express();

app.get("/api", (req, res) => {
  res.send("WELCOME ");
});
