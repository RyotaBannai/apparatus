import React, { useState, useEffect, useCallback, SyntheticEvent } from "react";
import { NavLink } from "react-router-dom";
import { useStyles } from "../../assets/style/item/page.style";
import {
  Button,
  Box,
  Checkbox,
  Collapse,
  Grid,
  Icon,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import * as _ from "lodash";

interface IProps {
  row: Item.Item;
  selectable: {
    is_selectable: boolean;
    add?: any;
    remove?: any;
    selected?: any;
  };
}

function ItemListTableRow(props: IProps) {
  const { row, selectable } = props;
  const classes = useStyles();
  const [goToItem, setGoToItem] = useState<boolean>();
  const is_selected = selectable.selected?.items.includes(Number(row.id));

  const pressCheckBoxHandler = useCallback(
    (e) => {
      const is_checked = e.target.checked;
      const payload = {
        id: Number(e.target.value),
        add_to: "items",
      };
      if (is_checked) {
        selectable.add(payload);
      } else {
        selectable.remove(payload);
      }
    },
    [selectable]
  );

  const toggleGotoEdit = useCallback(
    (e: SyntheticEvent) => setGoToItem(!goToItem),
    [goToItem]
  );

  useEffect(() => {}, [selectable]);

  return (
    <>
      <TableRow hover className={classes.root}>
        {selectable.is_selectable ? (
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
        <TableCell onClick={toggleGotoEdit}>{row?.data}</TableCell>
        <TableCell onClick={toggleGotoEdit}>
          {row?.description ?? "No description"}
        </TableCell>
      </TableRow>
      {goToItem ? (
        <TableRow className={classes.root}>
          <TableCell colSpan={2}>
            <Collapse in={goToItem} timeout="auto" unmountOnExit>
              <Box margin={1} style={{ margin: 0 }}>
                <Grid container direction="row" spacing={1}>
                  <Grid item className={classes.note} xs={10}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Note
                    </Typography>
                    <div>{row?.note ?? "No note"}</div>
                  </Grid>
                  <Grid item xs={2}>
                    <NavLink exact to={`/item_edit/${row.id}`}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        endIcon={<Icon>arrow_right</Icon>}
                        disableRipple
                        disableTouchRipple
                      >
                        Edit
                      </Button>
                    </NavLink>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : (
        <></>
      )}
    </>
  );
}

export { ItemListTableRow as default };
