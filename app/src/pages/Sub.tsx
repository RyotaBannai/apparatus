import React from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";

interface Props {}

const GET_TODOS = gql`
  {
    todos @client {
      id
      completed
      text
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($id: Float!, $completed: Boolean!, $text: String!) {
    addTodo(id: $id, completed: $completed, text: $text) @client
  }
`;

const resolvers = {
  Mutation: {
    // Doesn't matter the object type is Mutation or other name.
    addTodo: (_root: any, variables: any, { cache, getCacheKey }: any) => {
      //const id = getCacheKey({ __typename: "Todo", id: variables.id });
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
      // you can also do cache.writeData({ data }) here if you prefer
      cache.writeQuery({
        query, // passing the shape of data to check whether the passing data is the same as the shape of the data
        data: { todos: [...data.todos, myNewTodo] },
      });
      return null;
    },
    // TODO: You should not split CRUD different resolver here.
    updateTodo: (_root: any, variables: any, { cache, getCacheKey }: any) => {
      const id = getCacheKey({ __typename: "Todo", id: variables.id });
      const query = gql`
        fragment TodoQuery on Toto {
          id
          text
          completed
        }
      `;
      const todo = cache.readFragment({ query, id });
      // console.log(data);
      // const myNewTodo = {
      //   ...variables,
      //   __typename: "Todo",
      // };
      // cache.writeQuery({
      //   query,
      //   data: { todos: [...data.todos, myNewTodo] },
      // });
      return null;
    },
  },
};

class Counter {
  constructor(private _uuid: number = 0) {}
  get uuid() {
    return this._uuid++;
  }
}
const counter = new Counter();

export const Sub: React.FC<Props> = () => {
  let input: any = "";
  const { data } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO);
  const client = useApolloClient();
  client.addResolvers(resolvers);

  return (
    <div style={{ margin: "10px" }}>
      <input
        ref={(node) => {
          input = node;
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={(e: any) => {
          e.preventDefault();
          let variables: any = {
            id: counter.uuid,
            completed: false,
            text: input.value,
          };
          addTodo({
            variables,
          });
          input.value = "";
        }}
      >
        Add Todo
      </Button>
      {data.todos.map((todo: any) => (
        <p key={todo.id}>{todo.text}</p>
      ))}
    </div>
  );
};
