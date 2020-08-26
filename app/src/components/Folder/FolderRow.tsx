import React, { useState, useEffect, FC } from "react";
import {
  ListItemIcon,
  Typography,
  TableCell,
  TableRow,
} from "@material-ui/core";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

interface IProps {
  folder: Folder.Folder;
  lists_count: number;
}

export const FolderRow: FC<IProps> = (props) => {
  const { folder, lists_count } = props;
  const children_folder_count = folder?.children?.length ?? 0;
  useEffect(() => {
    console.log(folder);
  }, [folder]);
  return (
    <>
      <TableRow hover>
        <NavLink exact to={`${folder?.id}`}>
          <TableCell style={{ width: "100%", display: "block" }}>
            <Typography style={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon>
                <ViewColumnIcon />
              </ListItemIcon>
              <div>{folder.name}</div>
              <StyledCell>{folder.description}</StyledCell>|
              <StyledCell>
                Contains {children_folder_count}{" "}
                {children_folder_count > 1 ? "folders" : "folder"} and{" "}
                {lists_count} {lists_count > 1 ? "lists" : "list"}
              </StyledCell>
            </Typography>
          </TableCell>
        </NavLink>
      </TableRow>
    </>
  );
};

const StyledCell = styled.div`
  margin: 0 10px;
  color: rgba(0, 0, 0, 0.54);
`;
