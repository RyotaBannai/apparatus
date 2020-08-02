import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { NavLink } from "react-router-dom";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_SETS } from "../../modules/set/queries";
import { useWorkspace } from "../../modules/workspace/actions";
import { getCurrentWS, setCurrentWS } from "../../modules/workspace/actions";
import { useStyles } from "../../assets/style/set/page.style";
import { Items } from "../../modules/item/actions";
import { Set } from "../../modules/set/actions";
import { Workspace } from "../../modules/workspace/actions";
import {
  Button,
  Box,
  Collapse,
  Grid,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";

function createData(id: number, name: string, items: Items) {
  return {
    id,
    name,
    items,
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
      <TableRow hover className={classes.root}>
        <TableCell onClick={(e: SyntheticEvent) => setGoToWS(!goToWS)}>
          {row.name}
        </TableCell>
        <TableCell onClick={(e: SyntheticEvent) => setGoToWS(!goToWS)}>
          {row.item_count}
        </TableCell>
      </TableRow>
      {goToWS ? (
        <TableRow className={classes.root}>
          <TableCell className={classes.itemTable} colSpan={2}>
            <Collapse
              in={goToWS}
              timeout="auto"
              unmountOnExit
            >
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

interface Props {}

const ListPage: FC<Props> = () => {
  const { loading: sg_loading, error: sg_error, data, refetch } = useQuery(
    S_GET_SETS, {
      variables: {
        wsId: Number(getCurrentWS().id)
      }
    }
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
          <h2>Set List</h2>
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

export { ListPage as default };
