import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Button, Grid, Icon } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ApparatusLine } from "./ApparatusLine";
import cyan from "@material-ui/core/colors/cyan";
import * as _ from "lodash";
import { from } from "rxjs";
import { tap, map } from "rxjs/operators";

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

const L_CLEAN_ITEMS = gql`
  mutation CLEAN_ITEMS {
    cleanItems @client
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
  const callSetChild = (_children: Array<any> | null) => {
    let newChildren;
    if (_children instanceof Array) {
      newChildren = [
        ..._children,
        {
          id: takeId(),
          item: <ApparatusLine id={counter.uuid} />,
        },
      ];
    } else {
      newChildren = [
        {
          id: takeId(),
          item: <ApparatusLine id={counter.uuid} />,
        },
      ];
    }
    setChild(newChildren);
  };
  const { data } = useQuery(L_GET_ITEM);
  const [
    s_addItem,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_ADD_ITEM);
  const [l_cleanItems] = useMutation(L_CLEAN_ITEMS);

  if (sa_loading) return <p>Loading...</p>;
  if (sa_error) return <p>Error :(</p>;
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
              callSetChild(children);
            }}
          >
            Add Item
          </Button>
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
              from(data.items)
                .pipe(
                  map((item) => {
                    _.unset(item, "__typename");
                    return item;
                  })
                )
                .subscribe({
                  next(variables) {
                    console.log(variables);
                    if (
                      variables instanceof Object &&
                      "data" in variables &&
                      variables["data"] !== ""
                    )
                      s_addItem({
                        variables,
                      });
                  },
                  error(err) {
                    console.log(`Rxjs at Item Add component. ${err}`);
                  },
                  complete() {
                    console.log("done");
                    l_cleanItems();
                    callSetChild(null);
                  },
                });
            }}
          >
            Save Item
          </Button>
          {sa_called ? <Grid item>"Item is stored!"</Grid> : ""}
        </Grid>
      </Grid>
    </div>
  );
};
