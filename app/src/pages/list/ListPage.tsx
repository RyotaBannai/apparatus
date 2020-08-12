import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { NavLink } from "react-router-dom";
import { S_GET_LISTS } from "../../api/graphql/listQueries";
import { useStyles } from "../../assets/style/workspace/page.style";
import {
  Button,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";

const returnData = (lists: ApparatusList.ListData[]) =>
  lists.map((list: ApparatusList.ListData) => createData({ ...list }));

function createData({
  id,
  name,
  description,
  targets,
}: ApparatusList.ListData) {
  return {
    id,
    name,
    description,
    targets_count: targets.length,
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
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

interface Props {}

const ListPage: FC<Props> = () => {
  const { data, refetch } = useQuery(S_GET_LISTS);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      {data?.getLists.length > 0 ? (
        <div>
          <h2>Lists</h2>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Item / Set Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {returnData(data.getLists).map((row) => (
                  <Row key={uuidv4()} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div>No list found</div>
      )}
    </>
  );
};

export { ListPage as default };
