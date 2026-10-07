import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

import { Product } from "./Product.js";
import { User } from "./User.js";

export enum Status {
  ACCEPTED = "accepted",
  CANCELED = "canceled",
}

@Entity("orders")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @ManyToOne(() => User, (user: User) => user.orders, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" } )
  user!: User;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_price!: number;

  // @Column({ type: "int"})
  // Price!: number;

  @Column({ type: "enum", enum: Status, default: Status.ACCEPTED })
  status!: Status;

  @ManyToMany(() => Product, (product: Product) => product.orders)
  @JoinTable({
    name: "order_items", // new table naem
    joinColumn: { name: "orderId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "productId", referencedColumnName: "id" },
  })
  products!: Product[];

  @Column({type:"int" ,default:1})
  quantity!: number;

  @CreateDateColumn()
  order_date!: Date;
}
