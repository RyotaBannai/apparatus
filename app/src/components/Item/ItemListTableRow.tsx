import React, { useState, useEffect, useCallback, FC } from "react";
import { useHistory } from "react-router-dom";
import { useStyles } from "../../assets/style/item/page.style";
import { Checkbox, TableCell, TableRow } from "@material-ui/core";
import { StyledTableRow } from "../Parts/StyledTableRow";

interface IHoeverrable {
  is_set: boolean;
  children: JSX.Element[];
}

const ItemHoverable: FC<IHoeverrable> = (props) => {
  const { is_set, children } = props;
  const classes = useStyles();
  return (
    <>
      {is_set ? (
        <TableRow className={classes.root}>{children}</TableRow>
      ) : (
        <StyledTableRow hover className={classes.root}>
          {props.children}
        </StyledTableRow>
      )}
    </>
  );
};

interface IProps {
  is_set: boolean;
  row: Item.Item;
  selectable: ApparatusList.Selectable;
}

function ItemListTableRow(props: IProps) {
  const {
    is_set,
    row,
    selectable: { is_selectable, add, remove, selected },
  } = props;
  const history = useHistory();
  const is_selected = selected?.items.includes(Number(row.id));
  const goToEditItemPage = useCallback(
    () => history.push(`/item_edit/${row.id}`),
    [row]
  );

  const pressCheckBoxHandler = useCallback((e) => {
    const is_checked = e.target.checked;
    const payload = {
      id: Number(e.target.value),
      add_to: "items" as "items",
    };
    if (is_checked === true && add !== undefined) {
      add(payload);
    } else if (is_checked === false && remove !== undefined) {
      remove(payload);
    }
  }, []);

  useEffect(() => {}, [selected, is_selected]);

  return (
    <ItemHoverable is_set={is_set}>
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
      <TableCell onClick={goToEditItemPage} style={{ cursor: "pointer" }}>
        {row?.data}
      </TableCell>
      <TableCell onClick={goToEditItemPage} style={{ cursor: "pointer" }}>
        {row?.description ?? "No description"}
      </TableCell>
    </ItemHoverable>
  );
}

export { ItemListTableRow as default };
