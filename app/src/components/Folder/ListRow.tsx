import React, { useEffect, useCallback, FC } from "react";
import { useHistory } from "react-router-dom";
import {
  Checkbox,
  ListItemIcon,
  Typography,
  TableCell,
  TableRow,
} from "@material-ui/core";
import ViewHeadlineIcon from "@material-ui/icons/ViewHeadline";
import styled from "styled-components";

interface IProps {
  list: Folder.List;
  selectable: Folder.Selectable;
}

export const ListRow: FC<IProps> = (props) => {
  const { list, selectable } = props;
  const { is_selectable, add, remove, selected } = selectable;
  const is_selected = selected?.includes(list.id);
  const history = useHistory();
  const goToList = useCallback(() => history.push(`/list_edit/${list?.id}`), [
    list,
  ]);

  const pressCheckBoxHandler = useCallback((e) => {
    const is_checked = e.target.checked;
    const id = e.target.value;
    if (is_checked === true && add !== undefined) {
      add(id);
    } else if (is_checked === false && remove !== undefined) {
      remove(id);
    }
  }, []);

  useEffect(() => {}, [list, selectable]);
  return (
    <>
      <TableRow hover>
        {is_selectable ? (
          <TableCell style={{ width: "8%", textAlign: "center" }}>
            <Checkbox
              checked={is_selected}
              color="primary"
              inputProps={{ "aria-label": "secondary checkbox" }}
              style={{ margin: "auto" }}
              size={"small"}
              onChange={pressCheckBoxHandler}
              value={list.id}
            />
          </TableCell>
        ) : (
          <></>
        )}
        <TableCell
          style={{
            cursor: "pointer",
            width: is_selectable ? "92%" : "100%",
            display: is_selectable ? "" : "block",
          }}
          onClick={goToList}
        >
          <Typography style={{ display: "flex", alignItems: "center" }}>
            <ListItemIcon>
              <ViewHeadlineIcon />
            </ListItemIcon>
            <div>{list.name}</div>
            <StyledCell>{list.description}</StyledCell>
          </Typography>
        </TableCell>
      </TableRow>
    </>
  );
};

const StyledCell = styled.div`
  margin: 0 10px;
  color: rgba(0, 0, 0, 0.54);
`;
