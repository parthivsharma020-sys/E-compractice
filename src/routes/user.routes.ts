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

Router.get("/users", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
});

Router.post("/register", async (req, res) => {
  try {
    let { fName, lName, PN, email, password, role } = req.body;

    let pre = await User.findOne({ where: { email } });
    if (pre) {
      console.log(pre);
      return res.json("user already exists.. ,try to Login");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({
      first_name: fName,
      last_name: lName,
      email,
      role,
      phone_number: PN,
      password: hashedPassword,
    });
    const secret = process.env.NODE_ENV_JWTSEC;
    if (!secret) {
      throw new Error("unauthorized access");
    }
    const token: any = jwt.sign({ id: user.id, role }, secret, {
      expiresIn: "15h",
    });
    await user.save();
    res.cookie("token", token);
    return res.json(user);
  } catch (error) {
    console.log("ERROR IS THEEEEE---", error);
    res.send("somethin wwent wrong..");
  }
});

Router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const key: any = password;
    const user = await User.findOne({ where: { email } });
    // console.log(user);

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const login: boolean = await bcrypt.compare(key, user?.password);

    if (!login) {
      return res.json("creadintion not match..");
    }
    const secret = process.env.NODE_ENV_JWTSEC;
    if (!secret) {
      throw new Error("unauthorized access");
    }
    const token: any = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "15h",
    });
    console.log(token);
    res.cookie("token", token);
    res.json("loged in");
  } catch (error) {
    console.log(error);
  }
});

Router.post("/logout", isLoggedIn, (req: Request, res: Response) => {
  res.cookie("token", "");
  res.json("user logged out");
});
Router.post("/updates", isLoggedIn, async (req: Request, res: Response) => {
  let { fName, lName, PN, email, password } = req.body;
  const token = req.cookies?.token;

  if (!token) {
    res.json("unauthorized access");
  }
  const secret = process.env.NODE_ENV_JWTSEC;

  if (!secret) {
    throw new Error("somethin went wrong");
  }

  const tok: any = jwt.verify(token, secret);
  // console.log(id);

  const user: any = await User.findOneBy(tok?.id);
  if (!user) {
    res.json("unauthorized access");
  }
  User.merge(user, {
    first_name: fName,
    last_name: lName,
    phone_number: PN,
    email,
  });
  await user.save();

  res.json(user);
});

Router.post("/delete", isLoggedIn, async (req: Request, res: Response) => {
  // let { fName, lName, PN, email, password } = req.body;
  const token = req.cookies?.token;

  if (!token) {
    res.json("unauthorized access");
  }
  const secret = process.env.NODE_ENV_JWTSEC;

  if (!secret) {
    throw new Error("somethin went wrong");
  }

  const tok: any = jwt.verify(token, secret);
  // console.log(id);

  const user: any = await User.findOneBy(tok?.id);
  if (!user) {
    res.json("unauthorized access");
  }

  const Duser = await User.delete(user.id);

  res.json(Duser);
});

Router.post(
  "/:userId/cart",
  isLoggedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json("product id missing..");
      }
      const user = await User.findOne({
        where: { id: userId },
      });
      if (!user) {
        return res.status(404).json("User not found");
      }

      const product = await Product.findOne({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json("Product not found");
      }

      const CART = new CartItem();
      CART.user = user;
      CART.product = product;
      CART.quantity = Number(quantity);
      await CART.save();
      console.log(CART);
      // await user.save();

      return res.status(200).json("item added");
    } catch (err) {
      console.log("error adding to cart ", err);
      return res.status(500).json("Internal error");
    }
  },
);

Router.post(
  "/:userId/orders",
  isLoggedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, quantity } = req.body;
      const userId = Number(req.params.userId);
      const user = await User.findOne({
        where: { id: userId },
        relations: { cart: true },
      });
      if (!user) {
        return res.status(404).json("User not found");
      }

      // const totalPrice: number = u.reduce((sum, p) => sum + p.price, 0);
      const cart_available = CartItem.findOne({
        where: {
          user: { id: userId },
          product: { id: productId },
        },
      });
      // console.log(cart_available);
      if (!cart_available) {
        console.log("Product is not in the cart!");
      } else {
        console.log("Product is in the cart.");
      }
      const new_product = await Product.findOne({
        where: { id: productId },
      });
      const Price: any = new_product?.price as Number;

      // console.log(TotalPrice);
      // if (!Price) {
      //   return res.json("Price error...");
      // }
      const TotalPrice = Price * quantity;

      const order: Order = new Order();
      order.user = { id: userId } as User;
      order.status = Status.ACCEPTED;
      console.log("pricessss", TotalPrice);
      order.total_price = Number(TotalPrice);

      await order.save();
      // console.log(order, "-----------------------------------------");
      // const user_order=order.sel

      // await user.save();
      return res.status(200).json(order);
    } catch (err) {
      console.log("Error internal(not order placed yet)", err);
      return res.json("order not placed");
    }
  },
);

Router.get(
  "/:userid/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    const userid = Number(req.params.userid);

    const orders = await CartItem.find({
      where: { user: { id: userid } },
      relations: { product: true },
    });

    console.log(orders);
    return res.json(orders);
  },
);
// Router.post(
//   "/:id/delete",isLoggedIn,
//   async (req: Request, res: Response, next: NextFunction) => {
//     const id = Number(req.params.id);
//     const user = await User.find({ where: { id } });
//     return res.json(user);
//   },
// );

export default Router;
