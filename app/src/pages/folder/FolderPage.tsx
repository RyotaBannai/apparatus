import React, { useState, useEffect, useCallback, FC } from "react";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  S_GET_FOLDER,
  S_CREATE_FOLDER,
  S_DELETE_FOLDER,
} from "../../api/graphql/folderQueries";
import { S_GET_LISTS } from "../../api/graphql/listQueries";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { SnackbarAlert } from "../../components/Parts/SnackbarAlert";
import { FolderTitleSection } from "../../components/Folder/FolderTitleSection";
import { ListContents } from "../../components/Folder/ListContents";
import { FolderAddListSection } from "../../components/Folder/FolderAddListSection";
import { FolderDeleteListSection } from "../../components/Folder/FolderDeleteListSection";
import { COLOR } from "../../constants/color";

interface IProps {}
const FolderPage: FC<IProps> = () => {
  const [saveSnackBarOpen, setOpen] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [addable, setAddable] = useState(false);
  let { folder_id } = useParams<{ folder_id?: string }>();
  const history = useHistory();
  const { getCurrentWS } = useWSHelpers;

  const callSnackBarOpenHandler = useCallback(
    () => setOpen(!saveSnackBarOpen),
    [saveSnackBarOpen]
  );

  const toggleDeletableHandler = useCallback(() => setDeletable(!deletable), [
    deletable,
  ]);

  const toggleAddableHandler = useCallback(() => setAddable(!addable), [
    addable,
  ]);

  const { data: folder_data, refetch: refetchFolder } = useQuery(S_GET_FOLDER, {
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

  const [s_createFolder] = useMutation(S_CREATE_FOLDER, {
    onCompleted({ createFolder }) {
      callSnackBarOpenHandler();
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  const [s_deleteFolder] = useMutation(S_DELETE_FOLDER, {
    onCompleted({ deleteFolder }) {
      callSnackBarOpenHandler();
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

  const parseParentFolderJson = useCallback(
    () => JSON.parse(folder_data?.getFolder?.parent_folder),
    [folder_data]
  );

  const createFolderTree = useCallback((): JSX.Element[] => {
    if (
      folder_data === undefined ||
      folder_data?.getFolder === undefined ||
      folder_data?.getFolder === null
    )
      return [];
    else {
      let trees: Folder.Minimal[] = [];
      const folder = parseParentFolderJson();
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

  const createNewFolder = useCallback(async () => {
    const variables = {
      name: "New Folder",
      description: "Describe new folder",
      wsId: Number(getCurrentWS().id),
      parentId: Number(folder_data?.getFolder.id),
    };
    await s_createFolder({ variables });
    refetchFolder();
  }, [folder_data, refetchFolder]);

  const deleteFolder = useCallback(async () => {
    await s_deleteFolder({
      variables: {
        id: Number(folder_data?.getFolder.id),
      },
    });
    history.push(`/folder/${parseParentFolderJson().parent.id}`);
  }, [folder_data]);

  useEffect(() => {
    refetchFolder();
  }, [folder_id, folder_data]);

  return (
    <div>
      {folder_data !== undefined ? (
        <>
          <FolderTitleSection
            folder={folder_data?.getFolder}
            parents={createFolderTree()}
            createNewFolder={createNewFolder}
            deleteFolder={deleteFolder}
            refetchFolder={refetchFolder}
            is_deletable={deletable}
            is_addable={addable}
            callSnackBarOpenHandler={callSnackBarOpenHandler}
            toggleDeletableHandler={toggleDeletableHandler}
            toggleAddableHandler={toggleAddableHandler}
          />
          <FolderAddListSection
            is_addable={addable}
            folder_id={folder_data?.getFolder.id}
            lists={list_data?.getLists}
            callSnackBarOpenHandler={callSnackBarOpenHandler}
            refetchFolder={refetchFolder}
          />
          <FolderDeleteListSection
            is_deletable={deletable}
            folder_id={folder_data?.getFolder.id}
            callSnackBarOpenHandler={callSnackBarOpenHandler}
            refetchFolder={refetchFolder}
          />
          <ListContents
            id_deletable={deletable}
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
