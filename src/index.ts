import "reflect-metadata";
import "dotenv/config";

import express, { type Express } from "express";
import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Order } from "./entities/Order.js";
import { Product } from "./entities/Product.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";
import productRouter from "./routes/product.routes.js";
import { CartItem } from "./entities/Cart_item.js";

import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const main = async () => {
  try {
    const port = Number(process.env.NODE_ENV_PORT || 54332);
    const password = String(process.env.NODE_ENV_PASS || 1234);
    const connection = new DataSource({
      type: "postgres",
      host: "localhost",
      username: "postgres",
      port: port,
      password: password,
      database: "Ecom",
      entities: [User, Order, Product,CartItem],
      synchronize: true,
    });
    await connection.initialize();
    console.log(`connection On ${process.env.NODE_ENV_PORT}`);

    app.use("/users",userRouter);
    app.use(orderRouter);
    app.use(productRouter);

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
