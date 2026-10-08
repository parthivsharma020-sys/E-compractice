import express, { type Express } from "express";
const Router = express.Router();
import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";
// import { Product } from "../entities/Product.js";
// import { type JwtPayload } from "jsonwebtoken";
// import { isLoggedIn } from "../middlewares/isLoggedIn.js";
// import { Order } from "../entities/Order.js";
// // import "dotenv/config"
// import { CartItem } from "../entities/Cart_item.js";
// import { Status } from "../entities/Order.js";
import { ExpressError } from "../utils/ExpressError.js";

export const registerUser = async (req: Request, res: Response) => {
  let { fName, lName, PN, email, password, role } = req.body;

  let pre = await User.findOne({ where: { email } });
  if (pre) {
    //   console.log(pre);
    throw new ExpressError(409, "user already register..");
    //   return res.json("user already exists.. ,try to Login");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
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
    throw new ExpressError(401, "unauthorized access");
  }
  const token: any = jwt.sign({ id: user.id, role }, secret, {
    expiresIn: "15h",
  });
  await user.save();
  res.cookie("token", token);
  return res.json(user);
};
export const loginUser = async (req: Request, res: Response) => {
  let { email, password } = req.body;
  if (!email || !password) {
    throw new ExpressError(404, "provide email and password");
  }
  const key: any = password;
  const user = await User.findOne({ where: { email } });
  // console.log(user);

  if (!user || !user.password) {
    throw new ExpressError(404, "invalid creadintion");
  }
  const login: boolean = await bcrypt.compare(key, user?.password);

  if (!login) {
    throw new ExpressError(404, "creadintion not match..");
  }
  const secret = process.env.NODE_ENV_JWTSEC;
  if (!secret) {
    throw new ExpressError(404, "unauthorized access");
  }
  const token: any = jwt.sign({ id: user.id, role: user.role }, secret, {
    expiresIn: "15h",
  });
  if (!token) {
    throw new ExpressError(500, "internal server error");
  }
  // console.log(token);
  res.cookie("token", token);
  res.json("loged in");
};
export const logoutUser = (req: Request, res: Response) => {
  res.cookie("token", "");
  res.json("user logged out");
};

export const updateUser = async (req: Request, res: Response) => {
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
};

export const deleteUser = async (req: Request, res: Response) => {
  // let { fName, lName, PN, email, password } = req.body;
  const userId = req.params.userId;
  if (userId != req?.user?.id) {
    throw new ExpressError(403, "something went wrong");
  }
  const token = req.cookies?.token;

  if (!token) {
    throw new ExpressError(401, "unauthorize access");
    // res.json("unauthorized access");
  }
  const secret = process.env.NODE_ENV_JWTSEC;

  if (!secret) {
    throw new ExpressError(501, "somethin went wrong");
  }

  const tok: any = jwt.verify(token, secret);
  // console.log(id);

  const user: any = await User.findOneBy(tok?.id);
  if (!user) {
    throw new ExpressError(404, "unauthorized access");
  }

  const Duser = await User.delete(user.id);

  res.json(Duser);
};
