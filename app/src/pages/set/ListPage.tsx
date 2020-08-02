import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_SETS } from "../../modules/set/queries";
import { useWorkspace } from "../../modules/workspace/actions";
import { getCurrentWS, setCurrentWS } from "../../modules/workspace/actions";
import { useStyles } from "../../assets/style/workspace/page.style";
import { Items } from "../../modules/item/actions";
import { Set } from "../../modules/set/actions";
import { Workspace } from "../../modules/workspace/actions";
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

function createData(id: number, name: string, items: Items) {
  return {
    id,
    name,
    item_count: items.length,
  };
}
interface WrapProps {
  isCurrent: boolean;
  children: React.ReactElement<any, any>;
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const classes = useStyles();
  const [goToWS, setGoToWS] = useState<boolean>();

  return (
    <>
      {!goToWS ? (
        <TableRow
          hover
          className={classes.root}
          onClick={(e: SyntheticEvent) => setGoToWS(!goToWS)}
        >
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.item_count}</TableCell>
        </TableRow>
      ) : (
        <TableRow hover className={classes.root}>
          <TableCell>
            <Tooltip title="Cancel" placement="top">
              <Icon onClick={(e: SyntheticEvent) => setGoToWS(!goToWS)}>
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
              onClick={(): void => {}}
            >
              Go to this workspace
            </Button>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

interface Props {}

export const ListPage: FC<Props> = () => {
  const { loading: sg_loading, error: sg_error, data, refetch } = useQuery(
    S_GET_SETS
  );
  const returnData = (sets: Set[]) => {
    let rows: ReturnType<typeof createData>[] = [];
    for (const { id, name, items } of sets) {
      rows = [...rows, createData(id, name, items)];
    }
    return rows;
  };

  useEffect(() => {
    refetch();
  }, []);

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <>
      {data?.getSets.length > 0 ? (
        <div>
          <h2>Workspace List</h2>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Item Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {returnData(data.getSets).map((row) => (
                  <Row key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div>No set</div>
      )}
    </>
  );
};
