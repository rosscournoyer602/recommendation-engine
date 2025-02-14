import { Request, Response } from "express";
import { get, post, controller } from "./decorators";
import { Category } from "../entity/Category";
import { dataSource } from "../server";

@controller("")
class CategoryController {
  @get("/categories")
  async getAllCategories(req: Request, res: Response) {
    const categoryRepository = dataSource.getRepository(Category);
    const categories = await categoryRepository.find({
      select: {
        id: true,
        name: true,
      },
      relations: {
        products: true,
      },
    });
    res.send(categories);
  }

  @get("/category")
  async getCategory(req: Request, res: Response) {
    const categoryRepository = dataSource.getRepository(Category);
    const id = parseInt(req.query.id as string, 10);
    const category = await categoryRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
      },
      relations: {
        products: true,
      },
    });
    res.send(category);
  }

  @post("/categories/bulk")
  async BulkInsertCategories(req: Request, res: Response) {
    const categoryRepository = dataSource.getRepository(Category);
    const { categories } = req.body;
    await categoryRepository.save(categories);
    res.send(categories);
  }
}
