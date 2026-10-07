import express, { type Express } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User.js";
import { UserRole } from "../entities/User.js";
import { type Request, type Response, type NextFunction } from "express";
import { error } from "node:console";

export enum role {
  USER = "user",
  ADMIN = "admin",
  MANAGER = "manager",
}

interface JwtPayload {
  id: number;
  role: UserRole;
  email: string;
}

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json("unauthorized access");
    }
    const sec = process.env.NODE_ENV_JWTSEC;
    if (!sec) {
      throw new Error("node env not here");
    }
    const decoded = jwt.verify(token, sec) as JwtPayload;
    console.log(decoded);
    if (!decoded) {
      return res.json("unauthorized user..");
    }
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (er) {
    console.log(er);
  }
};

export const authorizeRoles = (...allowRoles: string[]) => {
 return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.role) {
        res.status(401).json(" User context missing");
        return;
      }
      const per = allowRoles.includes(req.user.role);

      if (!per) {
        res.status(403).json("Access denied : Insufficient permission");
        return;
      }
      console.log(req.user.log);
      // console.log(per);
      return next();
    } catch (er) {
      // console.log(er);
      res.status(500).json("server error");
    }
  };
};
