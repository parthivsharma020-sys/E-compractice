import { Entity,PrimaryGeneratedColumn ,JoinColumn,ManyToMany,ManyToOne,Column, BaseEntity } from "typeorm";
import { User } from "./User.js";
import { Product } from "./Product.js";


@Entity("cartItem")
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", default: 1 })
  quantity!: number;
//   @Column({ name: "user_id",type:"int" })
//   userId!: number;

  @ManyToOne(() => User, (user) => user.cart, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product!: Product;
}
