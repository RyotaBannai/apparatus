import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from "@apollo/client";
import { Sets, setStatus } from "./modules/set/actions";
import { workspace } from "./modules/workspace/actions";
import possibleTypes from "./introspection/possibleTypes.json";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";
import { Layout } from "./pages/layouts/Layout";
import { CreatePage as CreateWorkspacePage } from "./pages/workspace/CreatePage";
import { AddPage as AddItemPage } from "./pages/item/AddPage";
import { Sub } from "./pages/Sub";
import { Pagination } from "./pages/DemoPagination";
import { Login } from "./pages/Login";
import { Signin } from "./pages/Signin";

const cache = new InMemoryCache({
  possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        sets() {
          return Sets();
        },
        getSet(name: string, { args }) {
          return Sets().find((set) => set?.id === args?.id);
        },
        getSetStatus(name: string, { args }) {
          return setStatus().find((status) => status.id === args?.id);
        },
        getSetStatuses(name: string, { args }) {
          return setStatus();
        },
        getItem(_, { args }) {
          return Sets()
            .find((set) => set?.id === args?.set_id)
            ?.items.find((item) => item.id === args?.id);
        },
        getWorkspace(_, { args }) {
          return workspace();
        },
      },
    },
  },
});

const uri = "http://localhost:4000/graphql";
const httpLink = new HttpLink({ uri });
const authMiddleware = new ApolloLink((operation, forward) => {
  let token = localStorage.getItem("token");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
  connectToDevTools: true,
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <Layout>
            <Route
              exact
              path="/create_workspace"
              component={CreateWorkspacePage}
            />
            <Route exact path="/item" component={AddItemPage} />
            <Route exact path="/sub" component={Sub} />
            <Route exact path="/pagination" component={Pagination} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signin" component={Signin} />
          </Layout>
        </Router>
      </div>
    </ApolloProvider>
  );
}
