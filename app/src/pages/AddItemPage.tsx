import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { gql, useQuery, useMutation, ApolloError } from "@apollo/client";
import { useSet } from "../modules/set/actions";
import { Button, Grid, Icon, Snackbar } from "@material-ui/core";
import { ApparatusSet } from "../components/Item/ApparatusSet";
import { useStyles } from "../assets/style/item/page.style";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import * as _ from "lodash";
import { from } from "rxjs";
import { tap, map } from "rxjs/operators";

const S_ADD_ITEMS = gql`
  mutation ADD_ITEMS($data: String!) {
    createItems(data: { data: $data }) {
      res
    }
  }
`;

const L_GET_SET = gql`
  {
    sets @client {
      id
      name
      items
    }
  }
`;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface Props {}

export const AddItemPage: FC<Props> = () => {
  const classes = useStyles();
  const { takeId, filterSet, cleanSet } = useSet();
  const [children, setChild] = useState<Array<any>>([]);
  const [saveSnackBarOpen, setOpen] = useState(false);
  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const callSetChild = (_children: Array<any> | null) => {
    let newChildren;
    if (_children instanceof Array) {
      newChildren = [..._children, <ApparatusSet id={takeId()} />];
    } else {
      setChild([]);
      newChildren = [<ApparatusSet id={takeId()} />];
    }
    setChild(newChildren);
  };
  const { data } = useQuery(L_GET_SET);
  const [
    s_addItems,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_ADD_ITEMS, {
    onCompleted({ createItems: { res } }) {
      if (res === "Success") {
        cleanSet();
        callSetChild(null);
        setOpen(true);
      } else {
        console.log(
          "Apollo mutation createItems response's status is unexpected."
        );
      }
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  const sendItems = (e: SyntheticEvent) => {
    e.preventDefault();
    let jsoned_set = filterSet();
    s_addItems({
      variables: { data: jsoned_set },
    });
  };

  useEffect(() => {
    if (data.sets.length > 0) {
      let old_sets: any[] = [];
      for (const set of data.sets) {
        if (set instanceof Object && "id" in set) {
          old_sets = [...old_sets, <ApparatusSet {...set} />];
        }
      }
      setChild(old_sets);
    } else {
      callSetChild(null);
    }
  }, []);

  if (sa_loading) return <p>Loading...</p>;
  if (sa_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Add New Item</h2>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
      {children.map((child) => child)}
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            className={classes.addButton}
            startIcon={<Icon>add_circle</Icon>}
            disableRipple
            disableTouchRipple
            onClick={(e: SyntheticEvent) => {
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
            onClick={sendItems}
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
