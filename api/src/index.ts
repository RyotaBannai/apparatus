import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { buildSchema } from "type-graphql";
import { ItemResolver } from "./modules/item/ItemResolver";
import { UserResolver } from "./modules/user/UserResolver";
import { jwtMiddleware } from "./entity/User";
import { customAuthChecker } from "./entity/User";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";

const main = async () => {
  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  await createConnection({ ...options, name: "default" })
    .then(async () => console.log("Typeorm Success."))
    .catch((err) => console.log("Typeorm Error: ", err));

  const schema = await buildSchema({
    resolvers: [ItemResolver, UserResolver],
    authChecker: customAuthChecker,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      //jwtMiddleware(req, res);
    },
  });

  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main().catch((err) => console.log(err));
