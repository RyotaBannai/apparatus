import React from "react";
import { ApparatusRouter as Router } from "./Router";
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from "@apollo/client";
import { policy } from "../Policies/TypePolicies";
import possibleTypes from "../introspection/possibleTypes.json";
import { store } from "./store";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.scss";

const cache = new InMemoryCache({
  possibleTypes,
  typePolicies: policy.typePolicies,
});

const uri = "http://localhost:4001/graphql";
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
      <Provider store={store}>
        <div className="App">
          <Router />
        </div>
      </Provider>
    </ApolloProvider>
  );
}
