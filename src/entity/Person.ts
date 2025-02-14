import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Transaction } from "./Transaction";

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @OneToMany(() => Transaction, (transaction) => transaction.person)
  transactions!: Transaction[];
}
