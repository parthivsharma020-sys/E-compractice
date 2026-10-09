import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User.js";
import { OrderItem } from "./Order_item.js";

export enum Status {
  ACCEPTED = "accepted",
  CANCELED = "canceled",
}

@Entity("orders")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @ManyToOne(() => User, (user: User) => user.orders, {onDelete : 'SET NULL',nullable:true})
  @JoinColumn({ name: "user" })
  user!: User|null;

  @Column({ type: "int" })
  user_id!: number|null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_price!: number;

  @Column({ type: "enum", enum: Status, default: Status.ACCEPTED })
  status!: Status;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems!: OrderItem[];

  @CreateDateColumn()
  order_date!: Date;
}
