import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
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
}: // addees: Addee.Addees
ApparatusList.ListData) {
  return {
    id,
    name,
    description,
    // addee_count: addees.length,
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const classes = useStyles();
  const [goToList, setGoToList] = useState<boolean>();
  const selectThisListHanlder = () => {};

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
          <TableCell> addee count </TableCell>
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
            <Button
              variant="contained"
              color="primary"
              endIcon={<Icon>arrow_right</Icon>}
              disableRipple
              disableTouchRipple
              onClick={selectThisListHanlder}
            >
              Go to this List
            </Button>
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
