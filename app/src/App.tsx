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
import possibleTypes from "./introspection/possibleTypes.json";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";
import { Layout } from "./pages/layouts/Layout";
import { AddItemPage } from "./pages/AddItemPage";
import { Sub } from "./pages/Sub";
import { Pagination } from "./pages/DemoPagination";
import { Login } from "./pages/Login";
import { Signin } from "./pages/Signin";

const cache = new InMemoryCache({
  possibleTypes,
});

const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem("token") || null,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
  resolvers: {
    /** Please define resolvers in each component  addResolvers API **/
  },
  connectToDevTools: true,
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <Layout>
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
