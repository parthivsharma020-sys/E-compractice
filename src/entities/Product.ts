import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { OrderItem } from "./Order_item.js";
// import { OrderItem } from "./Order_item.js";

 export interface productType{
  name: string,
  price: number,
  stock: number,
  Description: string,
  colors: string,
  category: string,
  discount:number
    
}

@Entity("product")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Column({ type: "varchar", length: 200 })
  name!: string; 

  @Column({ type: "int" })
  price!: number;

  @Column({ type: "varchar" })
  category!: string; 

  @Column({ type: "int" ,default:0})
  stock!: number;

  @Column({ type: "text" }) 
  Description!: string; 

  @Column({ type: "int", nullable: true })
  discount!: number;

 
  @Column({ type: "text", nullable: true })
  colors!: string[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];
}
