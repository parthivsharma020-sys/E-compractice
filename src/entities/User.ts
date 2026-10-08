import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  JoinTable,
} from "typeorm";
import { Order } from "./Order.js";
import { Product } from "./Product.js";
import { CartItem } from "./Cart_item.js";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
}

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  first_name!: string;
  
  @Column({ type: "varchar" })
  last_name!: string;
  
  @Column({ type: "varchar", nullable: false })
  password!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role!: UserRole;


  @Column({ type: "varchar", length: 20, nullable: true })
  phone_number!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  address!: string;

  @Column({
    type: "int",
    unique: true,
    nullable: true,
  })
  card_number!: number;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user, { cascade: true })
  cart!: CartItem[];

  @Column({
    type: "boolean",
    nullable: false,
    default: true,
  })
  is_active!: boolean;

  @UpdateDateColumn()
  updated_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}
