import { gql } from "@apollo/client";

export const S_CREATE_LIST = gql`
  mutation CREATE_LIST($name: String!, $description: String!) {
    createList(data: { name: $name, description: $description }) {
      id
      name
    }
  }
`;

export const S_GET_LISTS = gql`
  {
    getLists {
      name
      description
      targets {
        ... on Item {
          id
          data
          type
        }
        ... on Set {
          name
          items {
            id
            data
            type
          }
        }
      }
    }
  }
`;
