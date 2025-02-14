require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import { AppRouter } from "./AppRouter";
import morgan from "morgan";
import cors from "cors";
import { DataSource } from "typeorm";
import "./controllers/rootController";
import "./controllers/personController";
import "./controllers/categoryController";
import "./controllers/productController";
import "./controllers/transactionController";
const { JogooClient, JogooInstall } = require("jogoo");

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRESDB_HOST || "localhost",
  port: 5432,
  username: process.env.POSTGRESDB_USER || "tsboilerplate",
  password: process.env.POSTGRESDB_ROOT_PASSWORD || "tsboilerplate",
  database: process.env.POSTGRESDB_DATABASE || "tsboilerplate",
  entities: ["build/entity/*.js"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  synchronize: true,
  // cli: {
  //   entitiesDir: "build/entity",
  //   migrationsDir: "build/migration",
  //   subscribersDir: "build/subscriber",
  // },
});
dataSource.initialize().then(() => {
  (async () => {
    let dbConfig = {
      dialect: "postgres",
      user: process.env.POSTGRESDB_USER,
      host: process.env.POSTGRESDB_HOST,
      database: process.env.POSTGRESDB_DATABASE,
      password: process.env.POSTGRESDB_ROOT_PASSWORD,
      syncronize: true,
    };
    let jogooClient = new JogooClient(dbConfig);
    await jogooClient.connect();
    // const jogooInstall = new JogooInstall(jogooClient);
    // await jogooInstall.do();
    // jogooClient.end();
  })();
  const app = express();
  app.use(cors());
  app.use(morgan("combined"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ type: "*/*" }));
  app.use(AppRouter.getInstance());
  app.listen(process.env.PORT || "8080");
  console.log(`App listening on port ${process.env.PORT || "8080"}`);
});
