import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { S_ADD_ITEMS } from "../../api/graphql/itemQueries";
import { Button, Grid, Icon } from "@material-ui/core";
import { ApparatusSet } from "../../components/Item/ApparatusSet";
import { SnackbarAlert } from "../../components/parts/SnackbarAlert";
import { useStyles } from "../../assets/style/item/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useSetActions } from "../../features/set/setFeatureSlice";
import { useSetHelpers } from "../../features/set/setHelpers";
import { v4 as uuidv4 } from "uuid";

interface Props {}

const CreatePage: FC<Props> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { cleanNewSets, removeShowFalse } = useSetActions();
  const { takeIdForSet, filterSet, getNewSets } = useSetHelpers;
  const sets = useSelector(getNewSets);

  const [children, setChild] = useState<Array<any>>([]);
  const [saveSnackBarOpen, setOpen] = useState(false);

  const callSetChild = (_children: Array<any> | null) => {
    let newChildren;
    let id = takeIdForSet();
    if (_children instanceof Array) {
      newChildren = [..._children, <ApparatusSet key={uuidv4()} id={id} />];
    } else {
      newChildren = [<ApparatusSet key={uuidv4()} id={id} />];
    }
    setChild(newChildren);
  };

  const [
    s_addItems,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_ADD_ITEMS, {
    onCompleted({ createItems: { res } }) {
      if (res === "Success") {
        dispatch(cleanNewSets(null));
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
    let jsoned_set = filterSet(sets);
    s_addItems({
      variables: { data: jsoned_set },
    });
  };

  useEffect(() => {
    if (sets.length > 0) {
      let old_sets: any[] = [];
      for (const set of sets) {
        if (set instanceof Object && "id" in set) {
          old_sets = [...old_sets, <ApparatusSet {...set} key={uuidv4()} />];
        }
      }
      setChild(old_sets);
    } else {
      callSetChild(null);
    }

    return () => {
      dispatch(removeShowFalse());
    };
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
          <SnackbarAlert isOpen={saveSnackBarOpen} />
        </Grid>
      </Grid>
    </div>
  );
};

export { CreatePage as default };
