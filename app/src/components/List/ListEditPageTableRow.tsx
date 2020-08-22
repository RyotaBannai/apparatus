import React, { useState, SyntheticEvent } from "react";
import { NavLink } from "react-router-dom";
import { useStyles } from "../../assets/style/workspace/page.style";
import { Button, Icon, TableCell, TableRow, Tooltip } from "@material-ui/core";
import { createData } from "./service";

interface IProps {
  row: ReturnType<typeof createData>;
}

function ListEditPageTableRow(props: IProps) {
  const { row } = props;
  const classes = useStyles();
  const [goToList, setGoToList] = useState<boolean>();

  return (
    <>
      {!goToList ? (
        <TableRow
          hover
          className={classes.root}
          onClick={(e: SyntheticEvent) => setGoToList(!goToList)}
        >
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.description}</TableCell>
          <TableCell> {row.targets_count} </TableCell>
        </TableRow>
      ) : (
        <TableRow hover className={classes.root}>
          <TableCell>
            <Tooltip title="Cancel" placement="top">
              <Icon onClick={(e: SyntheticEvent) => setGoToList(!goToList)}>
                close
              </Icon>
            </Tooltip>
          </TableCell>
          <TableCell colSpan={2}>
            <NavLink exact to={`list_edit/${row.id}`}>
              <Button
                variant="contained"
                color="primary"
                endIcon={<Icon>arrow_right</Icon>}
                disableRipple
                disableTouchRipple
              >
                Go to this List
              </Button>
            </NavLink>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export { ListEditPageTableRow as default };
