import React, { useState, useEffect, FC } from "react";
import {
  ListItemIcon,
  Typography,
  TableCell,
  TableRow,
} from "@material-ui/core";
import ViewHeadlineIcon from "@material-ui/icons/ViewHeadline";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

interface IProps {
  list: Folder.List;
}

export const ListRow: FC<IProps> = (props) => {
  const { list } = props;
  useEffect(() => {}, [list]);
  return (
    <>
      <TableRow hover>
        <NavLink exact to={`/list_edit/${list?.id}`}>
          <TableCell style={{ width: "100%", display: "block" }}>
            <Typography style={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon>
                <ViewHeadlineIcon />
              </ListItemIcon>
              <div>{list.name}</div>
              <StyledCell>{list.description}</StyledCell>
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
