import React, { useEffect, useCallback, FC } from "react";

import { TableContainer, Table, TableBody, Paper } from "@material-ui/core";

import { ListRow } from "./ListRow";
import { FolderRow } from "./FolderRow";

interface IProps {
  children: Folder.Folder[];
  lists: Folder.List[];
}

export const ListContents: FC<IProps> = (props) => {
  const { children, lists } = props;
  useEffect(() => {}, [children, lists]);
  return (
    <>
      <TableContainer component={Paper} style={{ marginTop: 25 }}>
        <Table aria-label="collapsible table">
          <TableBody>
            {children !== undefined ? (
              children.map((folder: Folder.Folder) => (
                <FolderRow folder={folder} lists_count={0} />
              ))
            ) : (
              <></>
            )}
            {lists !== undefined ? (
              lists.map((list: Folder.List) => <ListRow list={list} />)
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
