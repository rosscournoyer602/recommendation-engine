import { Request, Response } from "express";
import { get, post, controller } from "./decorators";
import { Product } from "../entity/Product";
import { dataSource } from "../server";

@controller("")
class ProductController {
  @get("/products")
  async getAllProducts(req: Request, res: Response) {
    const productRepository = dataSource.getRepository(Product);
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
        transactions: true,
      },
    });
    res.send(products);
  }

  @get("/product")
  async getProduct(req: Request, res: Response) {
    const productRepository = dataSource.getRepository(Product);
    const id = parseInt(req.query.id as string, 10);
    const product = await productRepository.findOne({
      where: { id },
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
    res.send(product);
  }

  @post("/products/bulk")
  async BulkInsertProducts(req: Request, res: Response) {
    const productRepository = dataSource.getRepository(Product);
    const { products } = req.body;
    await productRepository.save(products);
    res.send(`${products.length} products added.`);
  }
}
