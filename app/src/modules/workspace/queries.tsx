import { gql } from "@apollo/client";

export const L_GET_WORKSPACE = gql`
  {
    getWorkspace @client {
      name
      description
    }
  }
`;

export const S_CREATE_WORKSPACE = gql`
  mutation CREATE_WORKSPACE($name: String!, $description: String!) {
    createWorkspace(data: { name: $name, description: $description }) {
      id
      name
    }
  }
`;
