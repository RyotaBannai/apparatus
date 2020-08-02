import { gql } from "@apollo/client";

export const S_GET_SETS = gql`
  {
    getSets {
      id
      name
      items {
        id
        type
        data
      }
    }
  }
`;
