import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useStyles } from "../../assets/style/set/page.style";
import { Checkbox, TableCell, TableRow } from "@material-ui/core";
import { createData } from "./service";

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
    <TableRow hover className={classes.root}>
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
        {row.name}
      </TableCell>
      <TableCell onClick={goToEditSetPage} style={{ cursor: "pointer" }}>
        {row.item_count}
      </TableCell>
    </TableRow>
  );
}

export { SetListTableRow as default };
