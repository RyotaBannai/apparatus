import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useSet } from "../../modules/set/actions";
import { Button, Grid, Icon, Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ApparatusSet } from "./ApparatusSet";
import cyan from "@material-ui/core/colors/cyan";
import * as _ from "lodash";
import { from } from "rxjs";
import { tap, map } from "rxjs/operators";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const L_GET_SET = gql`
  {
    sets @client {
      id
      items
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
  let default_form: any[] = [
    {
      id: takeId(),
      item: <ApparatusSet id={counter.uuid} />,
    },
  ];
  const { allSets } = useSet();
  const [children, setChild] = useState<Array<any>>([]);
  const [saveSnackBarOpen, setOpen] = useState(false);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const callSetChild = (_children: Array<any> | null) => {
    let newChildren;
    if (_children instanceof Array) {
      newChildren = [
        ..._children,
        {
          id: takeId(),
          item: <ApparatusSet id={counter.uuid} />,
        },
      ];
    } else {
      newChildren = [
        {
          id: takeId(),
          item: <ApparatusSet id={counter.uuid} />,
        },
      ];
    }
    setChild(newChildren);
  };
  const { data } = useQuery(L_GET_SET);
  const [
    s_addItem,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_ADD_ITEM);
  const [l_cleanItems] = useMutation(L_CLEAN_ITEMS);

  useEffect(() => {
    if (data.sets.length > 0) {
      let newChildren: any[] = [];
      from(data.sets)
        .pipe(
          map((item) => {
            _.unset(item, "__typename");
            return item;
          })
        )
        .subscribe({
          next(item) {
            if (item instanceof Object && "id" in item) {
              newChildren = [
                ...newChildren,
                {
                  id: item["id"],
                  item: <ApparatusSet {...item} />,
                },
              ];
            }
          },
          error(err) {
            console.log(`Rxjs at Item Add component. ${err}`);
          },
          complete() {
            setChild(newChildren);
          },
        });
    } else {
      setChild(default_form);
    }
  }, []);

  if (sa_loading) return <p>Loading...</p>;
  if (sa_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Add New Item</h2>
      <pre>{JSON.stringify(data, null, 1)}</pre>
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
                    l_cleanItems();
                    callSetChild(null);
                    setOpen(true);
                  },
                });
            }}
          >
            Save Item
          </Button>
          <Snackbar
            open={saveSnackBarOpen}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="success">
              Successfully saved!
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </div>
  );
};
