import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useStyles } from "../../assets/style/set/page.style";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { createData } from "./service";
import { StyledTableRow } from "../Parts/StyledTableRow";
import ItemListTableRow from "../../components/Item/ItemListTableRow";
import { v4 as uuidv4 } from "uuid";

interface IProps {
  row: ReturnType<typeof createData>;
  selectable: ApparatusList.Selectable;
}

function SetListTableRow(props: IProps) {
  const {
    row,
    selectable: { is_selectable, add, remove, selected },
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const is_selected = selected?.sets.includes(Number(row.id));
  const goToEditSetPage = useCallback(
    () => history.push(`/set_edit/${row.id}`),
    [row]
  );

  const pressCheckBoxHandler = useCallback((e) => {
    const is_checked = e.target.checked;
    const payload = {
      id: Number(e.target.value),
      add_to: "sets" as "sets",
    };
    if (is_checked === true && add !== undefined) {
      add(payload);
    } else if (is_checked === false && remove !== undefined) {
      remove(payload);
    }
  }, []);

  useEffect(() => {}, [selected]);

  return (
    <StyledTableRow hover className={classes.root}>
      {is_selectable ? (
        <TableCell>
          <Checkbox
            checked={is_selected}
            color="primary"
            inputProps={{ "aria-label": "secondary checkbox" }}
            size={"small"}
            onChange={pressCheckBoxHandler}
            value={row.id}
          />
        </TableCell>
      ) : (
        <></>
      )}
      <TableCell onClick={goToEditSetPage} style={{ cursor: "pointer" }}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          component="p"
          style={{ marginLeft: 10 }}
        >
          {row.name}
        </Typography>
        <Table aria-label="collapsible table" size={"small"}>
          <TableHead>
            <TableRow>
              <TableCell style={{ padding: "0" }} />
              <TableCell style={{ padding: "0" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {row.items.map((row) => (
              <ItemListTableRow
                is_set={true}
                key={uuidv4()}
                row={row}
                selectable={{ is_selectable: false }}
              />
            ))}
          </TableBody>
        </Table>
      </TableCell>
    </StyledTableRow>
  );
}

export { SetListTableRow as default };
