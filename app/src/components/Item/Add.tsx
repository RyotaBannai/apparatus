import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Button, Grid, Icon } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ApparatusLine } from "./ApparatusLine";
import cyan from "@material-ui/core/colors/cyan";
import * as _ from "lodash";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addButton: {
      color: "#fff",
      backgroundColor: cyan[700],
      "&:hover": {
        backgroundColor: cyan[800],
      },
      "&:focus": {
        outlineColor: cyan[800],
      },
    },
  })
);

interface Props {}

const S_ADD_ITEM = gql`
  mutation ADD_ITEM($data: String!, $type: String!) {
    createItem(data: { data: $data, type: $type }) {
      id
      data
      type
    }
  }
`;

const L_GET_ITEM = gql`
  {
    items @client {
      type
      data
    }
  }
`;

class Counter {
  constructor(private _uuid: number = 0) {}
  get uuid() {
    return this._uuid;
  }
  set uuid(num) {
    this._uuid = this._uuid + num;
  }
}
const counter = new Counter();
const takeId = () => {
  counter.uuid = 1;
  return counter.uuid;
};

export const Add: React.FC<Props> = () => {
  const classes = useStyles();
  let default_form = [
    {
      id: takeId(),
      item: <ApparatusLine id={counter.uuid} />,
    },
  ];
  const [children, setChild] = useState(default_form);
  const { data } = useQuery(L_GET_ITEM);
  const [add, { loading, error, called }] = useMutation(S_ADD_ITEM);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Add New Item</h2>
      {JSON.stringify(data)}
      {children.map((child) => child.item)}
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            className={classes.addButton}
            startIcon={<Icon>add_circle</Icon>}
            disableRipple
            disableTouchRipple
            onClick={(e) => {
              e.preventDefault();
              setChild([
                ...children,
                {
                  id: takeId(),
                  item: <ApparatusLine id={counter.uuid} />,
                },
              ]);
            }}
          >
            Add Item
          </Button>
          {called ? <Grid item>"Item is stored!"</Grid> : ""}
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Icon>arrow_right</Icon>}
            disableRipple
            disableTouchRipple
            onClick={(e) => {
              e.preventDefault();
              // console.log(_data.value);
              // add({ variables: { data: _data.value, type: type.value } });
              // _data.value = "";
              // type.value = "";
            }}
          >
            Save Item
          </Button>
          {called ? <Grid item>"Item is stored!"</Grid> : ""}
        </Grid>
      </Grid>
    </div>
  );
};
