// @ts-nocheck
import { Request, Response } from "express";
import { get, post, controller } from "./decorators";
import { Transaction } from "../entity/Transaction";
import { Product } from "../entity/Product";
import { dataSource } from "../server";
import {
  recommendProductsForUser,
  recommendSimilarProducts,
} from "../vendor/recommendations";

@controller("")
class RecommendationController {
  @get("/recommendations/user")
  async getRecommendationsForUser(req: Request, res: Response) {
    const userId = req.query.userid;
    const transactionRepository = dataSource.getRepository(Transaction);
    const productRepository = dataSource.getRepository(Product);
    const transactions = await transactionRepository.find({
      select: {
        id: true,
      },
      relations: {
        person: true,
        product: true,
      },
    });
    const products = await productRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        category: { id: true, name: true },
      },
      relations: {
        category: true,
      },
    });
    const sanitized = transactions.map((transaction) => ({
      userId: transaction.person.id,
      productId: transaction.product.id,
    }));
    const recs = recommendProductsForUser(userId, sanitized, 5);
    console.log("RECS", recs);
    const productMap: { any: string } = {};
    products.forEach((product) => {
      productMap[product.id] = product;
    });
    res.send(recs.map((rec) => productMap[rec]));
  }

  @get("/recommendations/product")
  async getRecommendationsForProduct(req: Request, res: Response) {
    const productId = req.query.productid;
    const transactionRepository = dataSource.getRepository(Transaction);
    const productRepository = dataSource.getRepository(Product);
    const transactions = await transactionRepository.find({
      select: {
        id: true,
      },
      relations: {
        person: true,
        product: true,
      },
    });
    const products = await productRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        category: { id: true, name: true },
      },
      relations: {
        category: true,
      },
    });
    const sanitized = transactions.map((transaction) => ({
      userId: transaction.person.id,
      productId: transaction.product.id,
    }));
    console.log("SANITIZED", sanitized);
    const recs = recommendSimilarProducts(productId, sanitized, 5);
    console.log("RECS", recs);
    const productMap: { any: string } = {};
    products.forEach((product) => {
      productMap[product.id] = product;
    });
    res.send(recs.map((rec) => productMap[rec]));
  }

  @post("/transactions/bulk")
  async BulkInsertTransactions(req: Request, res: Response) {
    const transactionRepository = dataSource.getRepository(Transaction);
    const { transactions } = req.body;
    await transactionRepository.save(transactions);
    res.send(`${transactions.length} Transactions added.`);
  }
}
