import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory";
import introspectionQueryResultData from "./introspection/fragmentTypes.json";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";
import { Layout } from "./pages/layouts/Layout";
import { AddItemPage } from "./pages/AddItemPage";
import { Sub } from "./pages/Sub";
import { Pagination } from "./pages/DemoPagination";
import { Login } from "./pages/Login";
import { Signin } from "./pages/Signin";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const cache = new InMemoryCache({
  fragmentMatcher,
  cacheRedirects: {
    // useful if you have a list of item in the cache and want to get a few item from them.
    Query: {
      item: (_, { id }, { getOneItem }) =>
        getOneItem({ id, __typename: "Item" }),
    },
  },
});
const data = {
  items: [],
  visibilityFilter: "SHOW_ALL",
  networkStatus: {
    __typename: "NetworkStatus",
    isConnected: false,
  },
};
// initialize local state
cache.writeData({ data });

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  console.log(token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  resolvers: {
    /** Please define resolvers in each component  addResolvers API **/
  },
  connectToDevTools: true,
});
// reset the store, say a user logs out.
client.onResetStore(async () => await cache.writeData({ data }));

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
