import React, { useState, useEffect, useCallback, SyntheticEvent } from "react";
import { NavLink } from "react-router-dom";
import { useStyles } from "../../assets/style/set/page.style";
import {
  Button,
  Box,
  Checkbox,
  Collapse,
  Grid,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
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
  const [goToSet, setGoToSet] = useState<boolean>();
  const is_selected = selected?.sets.includes(Number(row.id));

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
    <>
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
        <TableCell onClick={(e: SyntheticEvent) => setGoToSet(!goToSet)}>
          {row.name}
        </TableCell>
        <TableCell onClick={(e: SyntheticEvent) => setGoToSet(!goToSet)}>
          {row.item_count}
        </TableCell>
      </TableRow>
      {goToSet ? (
        <TableRow className={classes.root}>
          <TableCell className={classes.itemTable} colSpan={3}>
            <Collapse in={goToSet} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Grid
                  container
                  className={classes.itemListTop}
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Grid item>
                    <Typography variant="h6" gutterBottom component="div">
                      Items
                    </Typography>
                  </Grid>
                  <Grid item>
                    <NavLink exact to={`/set_edit/${row.id}`}>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<Icon>arrow_right</Icon>}
                        disableRipple
                        disableTouchRipple
                      >
                        Edit this set
                      </Button>
                    </NavLink>
                  </Grid>
                </Grid>
                <Table size="small" aria-label="items">
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell component="th" scope="row">
                          {item.type}
                        </TableCell>
                        <TableCell>{item.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

export { SetListTableRow as default };
