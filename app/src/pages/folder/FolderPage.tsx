import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_FOLDER } from "../../api/graphql/folderQueries";
import { S_GET_LISTS } from "../../api/graphql/listQueries";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFolderHelpers } from "../../features/folder/folderHelpers";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { SnackbarAlert } from "../../components/Parts/SnackbarAlert";
import { FolderTitleSection } from "../../components/Folder/FolderTitleSection";
import { ListContents } from "../../components/Folder/ListContents";
import { FolderAddListSection } from "../../components/Folder/FolderAddListSection";
import { COLOR } from "../../constants/color";

interface Props {}
const FolderPage: FC<Props> = () => {
  const [saveSnackBarOpen, setOpen] = useState(false);
  const { getCurrentWS } = useWSHelpers;
  let { folder_id } = useParams<{ folder_id?: string }>();

  let callSnackBarOpenHandler = useCallback(() => setOpen(!saveSnackBarOpen), [
    saveSnackBarOpen,
  ]);

  const { data: folder_data } = useQuery(S_GET_FOLDER, {
    variables: {
      id: folder_id ?? "",
      wsId: Number(getCurrentWS().id),
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  const { data: list_data } = useQuery(S_GET_LISTS, {
    variables: {
      wsId: Number(getCurrentWS().id),
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  const extractParentRecursive = (
    folder: Folder.Folder,
    trees: Folder.Minimal[] = []
  ) => {
    trees.push({ id: folder.id, name: folder.name });
    if (folder?.parent !== null && typeof folder.parent === "object") {
      extractParentRecursive(folder.parent, trees);
    }
  };

  const createSingleFolderLink = (
    id: number | undefined,
    name: string,
    color: string
  ) => {
    let link = id === undefined ? "" : `${id}`;
    return (
      <>
        <NavLink exact to={link} style={{ color }}>
          {name}
        </NavLink>
        <span style={{ margin: "0 5px" }}>/</span>
      </>
    );
  };

  const createFolderTree = useCallback((): JSX.Element[] => {
    if (folder_data === undefined || folder_data.getFolder === null) return [];
    else {
      let trees: Folder.Minimal[] = [];
      const folder = JSON.parse(folder_data?.getFolder.parent_folder);
      extractParentRecursive(folder, trees);
      let folder_hierarchy = trees
        .reverse()
        .map((folder: Folder.Minimal, index: number) =>
          createSingleFolderLink(
            folder.id,
            folder.name,
            index === trees.length - 1 ? COLOR.GREY : COLOR.BLUE
          )
        );
      return folder_hierarchy;
    }
  }, [folder_data]);

  useEffect(() => {}, [folder_id, folder_data]);

  return (
    <div>
      {folder_data !== undefined ? (
        <>
          <FolderTitleSection
            folder={folder_data?.getFolder}
            parents={createFolderTree()}
          />
          <FolderAddListSection
            folder_id={folder_data?.getFolder.id}
            lists={list_data?.getLists}
            callSnackBarOpenHandler={callSnackBarOpenHandler}
          />
          <ListContents
            children={folder_data?.getFolder.children_folder}
            lists={folder_data?.getFolder.lists}
          />
        </>
      ) : (
        <div>There is no such folder.</div>
      )}
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { FolderPage as default };
