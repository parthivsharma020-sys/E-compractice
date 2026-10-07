import {
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  Column,
  Entity,
} from "typeorm";
import { Order } from "./Order.js";

@Entity("product")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: Number;

  @Column({ type: "varchar", length: 200 })
  name!: Text;

  @Column({ type: "int" })
  price!: number;

  @Column({ type: "varchar" })
  category!: Text;

  @Column({ type: "int" })
  stock!: number;

  @Column({ type: "varchar", length: 500 })
  Description!: Text;

  @Column({ type: "int", nullable: true })
  discount!: number;

  @Column({ type: "text", nullable: true })
  colors!: Text[];

  @ManyToMany(() => Order, (order) => order.products)
  orders!: Order[];
}
