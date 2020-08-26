import { gql } from "@apollo/client";

export const S_CREATE_FOLDER = gql`
  mutation CREATE_FOLDER($wsId: Float!, $parentId: Float!) {
    createFolder(data: { wsId: $wsId, parentId: $parentId }) {
      id
      ownerId
      name
      description
    }
  }
`;

export const S_GET_FOLDER = gql`
  query GET_FOLDER($id: String!) {
    getFolder(id: $id) {
      id
      name
      description
      children_folder
      parent_folder
      lists {
        id
        name
        description
      }
    }
  }
`;

export const S_GET_FOLDERS = gql`
  query GET_FOLDERS($wsId: Float!) {
    getFolders(wsId: $wsId) {
      id
      name
      description
      children_folder
      parent_folder
      lists {
        id
        name
        description
      }
    }
  }
`;
