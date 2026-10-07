import express, { type Express } from "express";
import { type Request, type Response, type NextFunction } from "express";
import { Order,} from "../entities/Order.js";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";
import { ExpressError } from "../utils/ExpressError.js";
import { CartItem } from "../entities/Cart_item.js";
import { error } from "node:console";
import { OrderItem } from "../entities/Order_item.js";

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const orders = await Order.find({
    where: { user_id: Number(req.params.userId) },
  });
  if (!orders) {
    throw new ExpressError(204, "order not found");
  }
  return res.json(orders);
};
export const addToOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const items= req.body.items;

  const userId = Number(req.params.userId);
  console.log(items);
  if (items.length <= 0) {
    throw new ExpressError(204, "add to cart item");
  }
  const user = await User.findOne({
    where: { id: userId },
    relations: { cart: true },
  });
  // if (!user) {
  //   throw new ExpressError(404, "user not found");
  // }
  for (const item of items) {
    let { productId, quantity } = item;
    // console.log(productId, quantity);
    const product = await Product.findOne({ where: { id: productId } });
    // if here we only find then it make some error

    if (!product) {
      throw new ExpressError(204, "item not found");
    }
    if (product.stock < quantity) {
      throw new ExpressError(400, "insufficient item reduce quantity");
    }
    product.stock -= quantity;
    await product.save();

    const newOrderItem = new OrderItem();
    newOrderItem.product = product;
    newOrderItem.quantity = quantity;
    await newOrderItem.save();

    const order = new Order();

  }

  //   // const totalPrice: number = u.reduce((sum, p) => sum + p.price, 0);
  //   const cart_available = await CartItem.findOne({
  //     where: {
  //       user: { id: userId },
  //       product: { id: productId },
  //     },
  //   });
  //   console.log(cart_available);
  //   if (!cart_available) {
  //     throw new ExpressError(404, "product is not in cart ");
  //     console.log("Product is not in the cart!");
  //   }
  //   const new_product = await Product.findOne({
  //     where: { id: productId },
  //   });
  //   if (!new_product) {
  //     throw new ExpressError(204, "no content");
  //   }
  //   if (!(new_product?.stock < quantity)) {
  //     throw new ExpressError(401, `only ${new_product.stock} item available`);
  // }
  //   new_product.stock -= quantity;

  //   const Price: any = new_product?.price as Number;

  //   // console.log(TotalPrice);
  //   // if (!Price) {
  //   //   return res.json("Price error...");
  //   // }
  //   const TotalPrice = Price * quantity;

  //   const order: Order = new Order();
  //   order.user = { id: userId } as User;
  //   order.status = Status.ACCEPTED;

  //   console.log("pricessss", TotalPrice);
  //   order.total_price = Number(TotalPrice);

  //   await order.save();
  //   await new_product.save();
  //   await CartItem.delete({
  //     user: { id: userId },
  //     product: { id: productId },
  //   });
  return res.status(200).json(items);
};

export const usersCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.params.userId);

  const user = await User.find({ where: { id: userId } });
  if (!user) {
    throw new ExpressError(401, "user not found");
  }

  const cart = await CartItem.find({
    where: { user: { id: userId } },
    relations: { product: true },
  });
  if (!cart) {
    throw new ExpressError(404, "cart item not found");
  }

  console.log(cart);
  return res.json(cart);
};
// "users/:id/orders/:id"
// export const cancelOrder =
//   // async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const userId = Number(req.params.userId);
//   if (userId!=req.user?.id) {
//   throw new ExpressError(401,"")
// }
//   let { orderId } = req.body;
//   if (!orderId) {
//     throw new ExpressError(204, "no order avialable there");
//   }
//   const findOrder = await Order.findOne({where: {id: orderId ,user:{id: userId } }, relations:{products:true} });
//   if(!findOrder){
//     throw new ExpressError(404, "order not found ");
//   }
//   for (const product of findOrder.products) {
//     product.stock = +1;
//   }

//   console.log(findOrder);
//   // const product=await Product.find({where:{id:}})
//   const removed=await findOrder.remove();

//   res.json(removed);
//   // cons
// };
