import { gql } from "@apollo/client";

export const S_ADD_ITEMS = gql`
  mutation ADD_ITEMS($data: String!) {
    createItems(data: { data: $data }) {
      res
    }
  }
`;
