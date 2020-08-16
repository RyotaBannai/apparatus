import { gql } from "@apollo/client";

export const S_ADD_ITEMS = gql`
  mutation ADD_ITEMS($data: String!) {
    createItems(data: { data: $data }) {
      res
    }
  }
`;

export const S_EDIT_ITEMS = gql`
  mutation EDIT_ITEMS($data: String!) {
    updateItems(data: { data: $data }) {
      res
    }
  }
`;

export const S_GET_ITEMS = gql`
  query GET_ITEMS($wsId: Float!) {
    getItems(wsId: $wsId) {
      id
      type
      data
    }
  }
`;
