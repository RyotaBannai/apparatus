import React, { useEffect, useCallback, FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TableContainer, Table, TableBody, Paper } from "@material-ui/core";
import { ListRow } from "./ListRow";
import { FolderRow } from "./FolderRow";
import { useFolderActions } from "../../features/folder/folderFeatureSlice";
import { useFolderHelpers } from "../../features/folder/folderHelpers";

interface IProps {
  is_deletable: boolean;
  children: Folder.Folder[];
  lists: Folder.List[];
}

export const ListContents: FC<IProps> = (props) => {
  const { is_deletable, children, lists } = props;
  const dispatch = useDispatch();
  const {
    addSelectedListToDeletable,
    removeSelectedListToDeletable,
  } = useFolderActions();
  const onAddSelectedListHandler = (id: string) =>
    dispatch(addSelectedListToDeletable({ list_id: id }));
  const onRemoveSelectedListHandler = (id: string) =>
    dispatch(removeSelectedListToDeletable({ list_id: id }));
  const { getDeletable } = useFolderHelpers;
  const { selected_lists } = useSelector(getDeletable);

  const selectable: Folder.Selectable = {
    is_selectable: is_deletable,
    add: onAddSelectedListHandler,
    remove: onRemoveSelectedListHandler,
    selected: selected_lists,
  };

  useEffect(() => {}, [is_deletable, children, lists]);
  return (
    <>
      <TableContainer component={Paper} style={{ marginTop: 25 }}>
        <Table aria-label="collapsible table">
          <TableBody>
            {children !== undefined ? (
              children.map((folder: Folder.Folder) => (
                <FolderRow folder={folder} />
              ))
            ) : (
              <></>
            )}
            {lists !== undefined ? (
              lists.map((list: Folder.List) => (
                <ListRow selectable={selectable} list={list} />
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
