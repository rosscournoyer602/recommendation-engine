import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Person } from "./Person";
import { Product } from "./Product";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Person, (person) => person.transactions)
  person!: Person;

  @ManyToOne(() => Product, (product) => product.transactions)
  product!: Product;
}
