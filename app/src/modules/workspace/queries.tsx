import { gql } from "@apollo/client";

export const L_GET_WORKSPACE = gql`
  {
    l_getWorkspace @client {
      name
      description
    }
  }
`;

export const L_GET_CURRENT_WORKSPACE = gql`
  {
    currentWS @client {
      id
    }
  }
`;

export const S_GET_WORKSPACE = gql`
  query GET_WORKSPACE($id: String!) {
    getWorkspace(id: $id) {
      id
      name
      description
    }
  }
`;

export const S_GET_WORKSPACES = gql`
  {
    getWorkspaces {
      id
      name
      description
      items {
        id
        data
        type
      }
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

export const S_EDIT_WORKSPACE = gql`
  mutation EDIT_WORKSPACE($id: String!, $name: String!, $description: String!) {
    editWorkspace(data: { id: $id, name: $name, description: $description }) {
      id
      name
      description
    }
  }
`;
