import {type Request } from "express";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
          [key: string]: any;
        role:string
      };
    }
  }
}
