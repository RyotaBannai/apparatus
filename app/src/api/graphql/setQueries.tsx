import { gql } from "@apollo/client";

export const S_GET_SET = gql`
  query GET_SET($id: Float!) {
    getSet(id: $id) {
      id
      name
      items {
        id
        type
        data
        description
        note
      }
    }
  }
`;

export const S_GET_SETS = gql`
  query GET_SETS($wsId: Float!) {
    getSets(wsId: $wsId) {
      id
      name
      items {
        id
        type
        data
        description
        note
      }
    }
  }
`;
