import { gql } from "@apollo/client";

export const L_GET_ITEM = gql`
  query GET_ITEM($set_id: Float!, $id: Float!) {
    getItem(set_id: $set_id, id: $id) @client {
      type
      data
    }
  }
`;

export const L_GET_SETS = gql`
  {
    sets @client {
      id
      name
      items
    }
  }
`;

export const S_ADD_ITEMS = gql`
  mutation ADD_ITEMS($data: String!) {
    createItems(data: { data: $data }) {
      res
    }
  }
`;
