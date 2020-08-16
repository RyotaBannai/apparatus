import React, { useState, SyntheticEvent } from "react";
import { NavLink } from "react-router-dom";
import { useStyles } from "../../assets/style/set/page.style";
import {
  Button,
  Box,
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

function Row(props: { row: ApparatusSet.createDataType }) {
  const { row } = props;
  const classes = useStyles();
  const [goToSet, setGoToSet] = useState<boolean>();

  return (
    <>
      <TableRow hover className={classes.root}>
        <TableCell onClick={(e: SyntheticEvent) => setGoToSet(!goToSet)}>
          {row.name}
        </TableCell>
        <TableCell onClick={(e: SyntheticEvent) => setGoToSet(!goToSet)}>
          {row.item_count}
        </TableCell>
      </TableRow>
      {goToSet ? (
        <TableRow className={classes.root}>
          <TableCell className={classes.itemTable} colSpan={2}>
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
                    <NavLink exact to={`/item_edit/${row.id}`}>
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

export { Row as default };
