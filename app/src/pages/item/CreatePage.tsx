import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { useSet } from "../../modules/set/actions";
import { L_GET_SETS, S_ADD_ITEMS } from "../../modules/item/queries";
import { Button, Grid, Icon, Snackbar } from "@material-ui/core";
import { ApparatusSet } from "../../components/Item/ApparatusSet";
import { SnakbarAlert } from "../../components/parts/SnakbarAlert";
import { useStyles } from "../../assets/style/item/page.style";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import * as _ from "lodash";
import { from } from "rxjs";
import { tap, map } from "rxjs/operators";

interface Props {}

export const CreatePage: FC<Props> = () => {
  const classes = useStyles();
  const { takeId, filterSet, cleanSet } = useSet();
  const [children, setChild] = useState<Array<any>>([]);
  const [saveSnackBarOpen, setOpen] = useState(false);

  const callSetChild = (_children: Array<any> | null) => {
    let newChildren;
    let id = takeId();
    if (_children instanceof Array) {
      newChildren = [..._children, <ApparatusSet key={id} id={id} />];
    } else {
      setChild([]);
      newChildren = [<ApparatusSet key={id} id={id} />];
    }
    setChild(newChildren);
  };
  const { data } = useQuery(L_GET_SETS);
  const [
    s_addItems,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_ADD_ITEMS, {
    onCompleted({ createItems: { res } }) {
      if (res === "Success") {
        cleanSet();
        callSetChild(null);
        setOpen(!saveSnackBarOpen);
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
      <h2>Create New Item</h2>
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
          <SnakbarAlert isOpen={saveSnackBarOpen} />
        </Grid>
      </Grid>
    </div>
  );
};
