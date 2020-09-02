import React, { useEffect, useCallback, FC } from "react";
import {
  ListItemIcon,
  Typography,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import styled from "styled-components";
import { COLOR } from "../../constants/color";

interface IProps {
  folder: Folder.Folder;
}

export const FolderRow: FC<IProps> = (props) => {
  const { folder } = props;
  const children_folder_count = folder?.children_folder?.length ?? 0;
  const lists_count = folder?.lists?.length ?? 0;

  const history = useHistory();
  const goToFolder = useCallback(() => history.push(`/folder/${folder?.id}`), [
    folder,
  ]);

  useEffect(() => {}, [folder]);
  return (
    <TableRow hover onClick={goToFolder} style={{ cursor: "pointer" }}>
      <TableCell colSpan={2}>
        <Typography style={{ display: "flex", alignItems: "center" }}>
          <ListItemIcon>
            <ViewColumnIcon style={{ color: COLOR.BLUE }} />
          </ListItemIcon>
          <div>{folder.name}</div>
          <StyledCell>{folder.description}</StyledCell>|
          <StyledCell>
            Contains {children_folder_count}{" "}
            {children_folder_count > 1 ? "folders" : "folder"} and {lists_count}{" "}
            {lists_count > 1 ? "lists" : "list"}
          </StyledCell>
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const StyledCell = styled.div`
  margin: 0 10px;
  color: rgba(0, 0, 0, 0.54);
`;
