import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./modules/user/UserResolver";
import { ItemResolver } from "./modules/item/ItemResolver";
import { SetResolver } from "./modules/set/SetResolver";
import { AddeeResolver } from "./modules/addee/addeeResolver";
import { ListResolver } from "./modules/list/ListResolver";
import { FolderResolver } from "./modules/folder/folderResolver";
import { WorkspaceResolver } from "./modules/workspace/WorkspaceResolver";
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
    resolvers: [
      UserResolver,
      ItemResolver,
      SetResolver,
      AddeeResolver,
      ListResolver,
      FolderResolver,
      WorkspaceResolver,
    ],
    authChecker: customAuthChecker,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      const context = {
        req,
        res,
        user: req.user,
      };
      return context;
    },
  });

  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  app.use("/graphql", jwtMiddleware);

  apolloServer.applyMiddleware({ app });

  app.listen(4001, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main().catch((err) => console.log(err));
