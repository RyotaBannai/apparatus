import { gql } from "@apollo/client";

export const itemFragments = {
  item: gql`
    fragment ItemWithMeta on Item {
      id
      data
      type
      item_meta {
        description
        note
      }
    }
  `,
  itemData: gql`
    fragment ItemDataWithMeta on Item {
      id
      data
      type
      description
      note
    }
  `,
};

export const S_ADD_ITEMS = gql`
  mutation ADD_ITEMS($data: String!) {
    createItems(data: { data: $data }) {
      res
    }
  }
`;

export const S_EDIT_ITEM = gql`
  mutation EDIT_ITEM($data: String!) {
    updateItem(data: { data: $data }) {
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

export const S_GET_ITEM = gql`
  query GET_ITEM($id: Float!) {
    getItem(id: $id) {
      id
      type
      data
      item_meta {
        description
        note
      }
    }
  }
`;

export const S_GET_ITEMS = gql`
  query GET_ITEMS($wsId: Float!) {
    getPureItems(wsId: $wsId) {
      id
      type
      data
      item_meta {
        description
        note
      }
    }
  }
`;

export const S_DELETE_ITEM = gql`
  mutation DELETE_ITEM($id: Float!) {
    deleteItem(id: $id) {
      res
    }
  }
`;

export const S_DELETE_ITEMS = gql`
  mutation DELETE_ITEMS($set_id: Float!) {
    deleteItems(set_id: $set_id) {
      res
    }
  }
`;
