import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "../entity/Category";
import { Transaction } from "./Transaction";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("text")
  description!: string;

  @Column("text")
  image_url!: string;

  @ManyToOne(() => Category, (category) => category.id)
  category!: Category;

  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions!: Transaction[];
}
