import express, { type Express } from "express";
import { type Request, type Response, type NextFunction } from "express";
import { Order, Status } from "../entities/Order.js";
import { User } from "../entities/User.js";
import { Product } from "../entities/Product.js";
import { ExpressError } from "../utils/ExpressError.js";
import { CartItem } from "../entities/Cart_item.js";
import { AppDataSource } from "../index.js";
import { error } from "node:console";
import { OrderItem } from "../entities/Order_item.js";

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const orders = await Order.find({
    where: { user_id: Number(req.params.userId) },
    relations: {
      orderItems: {
        product: true,
      },
    },
  });

  if (!orders) {
    throw new ExpressError(204, "order not found");
  }
  console.log(orders);
  return res.json(orders);
};
export const addToOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const items = req.body.items;

  const userId = Number(req?.user?.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new ExpressError(401, "Invalid user");
  }
  console.log(items);

  if (items.length <= 0) {
    throw new ExpressError(400, "order item required");
  }
  const order = await AppDataSource.transaction(async (manager) => {
    const user = await manager.findOne(User, {
      where: { id: userId },
      relations: { cart: true },
    });
    if (!user) {
      throw new ExpressError(404, "user not found");
    }

    let totalPrice = 0;
    const orderItemsToSave: OrderItem[] = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      if (!Number.isInteger(productId) || productId <= 0) {
        throw new ExpressError(400, "Invalid product ID");
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new ExpressError(400, "Invalid quantity");
      }
      const product = await manager.findOne(Product, {
        where: { id: productId },
        lock: { mode: "pessimistic_write" },
      });
      // if here we only find then it make some error

      if (!product) {
        throw new ExpressError(404, "item not found");
      }

      if (product.stock < quantity) {
        throw new ExpressError(400, "insufficient item reduce quantity");
      }
      product.stock -= quantity;
      await manager.save(Product, product);

      const price = Number(product.price);
      totalPrice += Number(product.price) * quantity;

      const newOrderItem = new OrderItem();
      newOrderItem.product = product;
      newOrderItem.quantity = quantity;
      newOrderItem.price = price;
      orderItemsToSave.push(newOrderItem);
    }
    const order = new Order();
    order.user = { id: userId } as User;
    order.user_id = userId;
    order.status = Status.ACCEPTED;
    order.total_price = totalPrice;
    order.orderItems = orderItemsToSave;
    return await manager.save(Order, order);
    // await order.save();
  });
  return res.status(201).json({ message: "order placed successfully", order });
};

export const usersCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.params.userId);

  if (userId != req.user?.id) {
    throw new ExpressError(404, "user not found");
  }

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

// ("users/:id/orders/:id");
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.params.userId);
  if (userId != req.user?.id) {
    throw new ExpressError(401, "unauthorize access");
  }
  const { orderId } = req.body;
  if (!orderId) {
    throw new ExpressError(204, "specifie the item");
  }
  const findOrder = await Order.findOne({
    where: { id: orderId, user: { id: userId } },
    relations: { orderItems: { product: true } },
  });
  if (findOrder?.status == Status.CANCELED) {
    throw new ExpressError(404, "order already canceled");
  }
  if (!findOrder) {
    throw new ExpressError(404, "order not found ");
  }
  console.log(findOrder);

  for (const item of findOrder.orderItems) {
    if (item.product) {
      item.product.stock += item.quantity;
      await item.product.save();
    }
  }

  // console.log(findOrder);
  findOrder.status = Status.CANCELED;
  findOrder.save();
  // const removed = await findOrder.remove();

  return res.json(findOrder);
};
