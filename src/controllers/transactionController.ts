import { Request, Response } from "express";
import { get, post, controller } from "./decorators";
import { Transaction } from "../entity/Transaction";
import { dataSource } from "../server";

@controller("")
class TransactionController {
  @get("/transactions")
  async getAllTransactions(req: Request, res: Response) {
    const transactionRepository = dataSource.getRepository(Transaction);
    const transactions = await transactionRepository.find({
      select: {
        id: true,
      },
      relations: {
        person: true,
        product: true,
      },
    });
    res.send(transactions);
  }

  @get("/transaction")
  async getTransaction(req: Request, res: Response) {
    const transactionRepository = dataSource.getRepository(Transaction);
    const id = parseInt(req.query.id as string, 10);
    const transaction = await transactionRepository.findOne({
      where: { id },
      select: {
        id: true,
      },
      relations: {
        person: true,
        product: true,
      },
    });
    res.send(transaction);
  }

  @post("/transactions/bulk")
  async BulkInsertTransactions(req: Request, res: Response) {
    const transactionRepository = dataSource.getRepository(Transaction);
    const { transactions } = req.body;
    await transactionRepository.save(transactions);
    res.send(`${transactions.length} Transactions added.`);
  }
}
