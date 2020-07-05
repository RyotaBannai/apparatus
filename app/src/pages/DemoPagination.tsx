import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";

interface Props {}

const ITEM_FRAGMENTS = {
  fields: gql`
    fragment ItemFields on Item {
      id
      data
      type
    }
  `,
};

const LIST_FRAGMENTS = {
  fields: gql`
    fragment ListFields on List {
      id
      name
    }
  `,
};

const GET_ITEMS = gql`
  query GetItems($skip: Int, $take: Int, $current: Int) {
    getItems(skip: $skip, take: $take, current: $current)
      @connection(key: "items", filter: ["id"]) {
      ...ItemFields
      list {
        ...ListFields
      }
    }
  }
  ${ITEM_FRAGMENTS.fields}
  ${LIST_FRAGMENTS.fields}
`;

const resolvers = {
  Resolvers: {
    addTodo: (_root: any, variables: any, { cache, getCacheKey }: any) => {
      console.log("called");
      const query = gql`
        query TodoQuery {
          todos @client {
            id
            completed
            text
          }
        }
      `;
      const data = cache.readQuery({ query });
      const myNewTodo = {
        ...variables,
        __typename: "Todo",
      };
      cache.writeQuery({
        query,
        data: { todos: [...data.todos, myNewTodo] },
      });
      return null;
    },
  },
};

let fetch_options = { skip: 0, take: 2, current: 0 };
export const Pagination: React.FC<Props> = () => {
  useEffect(
    () => () => {
      console.log("cleaned up");
    },
    []
  );
  const { client, called, loading, error, data, fetchMore } = useQuery(
    GET_ITEMS,
    {
      variables: fetch_options,
      errorPolicy: "all",
      // fetchPolicy: "cache-and-network", // this have Apollo update automatically the returns...
    }
  );
  // const client = useApolloClient();
  client.addResolvers(resolvers);
  if (called && loading) return <p>Loading ...</p>;
  if (!called) {
    return <div>Press button to fetch next chunk</div>;
  }
  if (error)
    return (
      <pre style={{ textAlign: "left" }}>
        Bad: {JSON.stringify(error, null, 2)}
      </pre>
    );
  if (!data?.getItems) return <div>No data founded ...</div>;
  return (
    <div style={{ margin: "10px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={(e: any) => {
          e.preventDefault();
          fetch_options = {
            ...fetch_options,
            current: fetch_options.current + 1,
          };
          fetchMore({
            variables: fetch_options,
            updateQuery: (previousQueryResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) return previousQueryResult;
              return {
                getItems: [
                  ...previousQueryResult.getItems,
                  ...fetchMoreResult.getItems,
                ],
              };
            },
          });
        }}
      >
        Fetch Next
      </Button>
      <div>
        <h4>Item List</h4>
        {data.getItems.map((item: any) => (
          <p key={item.id}>{item.data}</p>
        ))}
      </div>
    </div>
  );
};
