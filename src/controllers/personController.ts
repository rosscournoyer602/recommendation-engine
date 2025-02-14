import { Request, Response } from "express";
import { get, post, controller } from "./decorators";
import { dataSource } from "../server";
import { Person } from "../entity/Person";

@controller("")
class PersonController {
  @get("/persons")
  async getPeople(req: Request, res: Response) {
    const peopleRepository = dataSource.getRepository(Person);
    const people = await peopleRepository.find({
      select: {
        id: true,
        name: true,
      },
      relations: {
        transactions: {
          product: true,
        },
      },
    });
    res.send(people);
  }

  @get("/person")
  async getPerson(req: Request, res: Response) {
    const peopleRepository = dataSource.getRepository(Person);
    const id = parseInt(req.query.id as string, 10);
    const person = await peopleRepository.findOne({
      where: {
        id,
      },
      select: {
        name: true,
      },
      relations: {
        transactions: {
          product: true,
        },
      },
    });
    res.send(person);
  }

  @post("/persons/bulk")
  async BulkInsertCategories(req: Request, res: Response) {
    const categoryRepository = dataSource.getRepository(Person);
    const { persons } = req.body;
    await categoryRepository.save(persons);
    res.send(persons);
  }
}
