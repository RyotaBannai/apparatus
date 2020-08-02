import { gql } from "@apollo/client";

export const L_GET_ITEM = gql`
  query GET_ITEM($set_id: Float!, $id: Float!) {
    getItem(set_id: $set_id, id: $id) @client {
      type
      data
    }
  }
`;

export const L_GET_SET = gql`
  query GET_SET($id: Float!) {
    getSet(id: $id) @client {
      id
      set_id_on_server
      name
      items
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

export const L_GET_SET_STATUS = gql`
  query GET_SET_STATUS($id: Float!) {
    getSetStatus(id: $id) @client {
      is_set
    }
  }
`;

export const L_GET_SET_STATUSES = gql`
  {
    getSetStatuses @client {
      id
      is_set
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
