import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_WORKSPACES } from "../../modules/workspace/queries";
import { useWorkspace } from "../../modules/workspace/actions";
import { useStyles } from "../../assets/style/workspace/page.style";
import { Items } from "../../modules/item/actions";
import { Workspaces } from "../../modules/workspace/actions";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

function createData(
  name: string,
  description: string
  // items: Items
) {
  //   let item_amount: number = 1;
  return {
    name,
    description,
    // item_amount,
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const classes = useStyles();
  // TODO: onClick でコンポネントを入れ替えて、Go to this workspace みたいにして切替をできるようにする
  // TODO: current Workspace にはハイライトをいれる
  return (
    <>
      <TableRow hover className={classes.root}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell> - </TableCell>
      </TableRow>
    </>
  );
}

interface Props {}

export const ListPage: FC<Props> = () => {
  const { addateWS } = useWorkspace();
  const classes = useStyles();
  const { data } = useQuery(S_GET_WORKSPACES);

  const returnData = (workspaces: Workspaces) => {
    let rows: ReturnType<typeof createData>[] = [];
    for (const { name, description } of workspaces) {
      rows = [...rows, createData(name, description)];
    }
    return rows;
  };

  return (
    <>
      {data?.getWorkspaces.length > 0 ? (
        <div>
          <h2>Workspace List</h2>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Item Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {returnData(data.getWorkspaces).map((row) => (
                  <Row key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div>No workspace</div>
      )}
    </>
  );
};
