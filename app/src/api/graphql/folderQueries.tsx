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
  query GET_FOLDER($id: String!, $wsId: Float!) {
    getFolder(id: $id, wsId: $wsId) {
      id
      name
      description
      children_folder {
        id
        name
        description
        children_folder {
          id
          name
          description
        }
        lists {
          id
          name
          description
        }
      }
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
      children_folder {
        id
        name
        description
        children_folder {
          id
          name
          description
        }
        lists {
          id
          name
          description
        }
      }
      parent_folder
      lists {
        id
        name
        description
      }
    }
  }
`;

export const S_ADD_LISTS = gql`
  mutation ADD_LISTS($lists: [Float!]!, $folderId: Float!) {
    addLists(data: { lists: $lists, folderId: $folderId }) {
      id
    }
  }
`;
