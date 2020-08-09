import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSetActions } from "../../features/set/setFeatureSlice";
import { useSetHelpers } from "../../features/set/setHelpers";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { S_GET_SET } from "../../api/graphql/setQueries";
import { S_EDIT_ITEMS } from "../../api/graphql/itemQueries";
import { useStyles } from "../../assets/style/item/page.style";
import { Button, Grid, Icon } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ApparatusSet } from "../../components/Item/ApparatusSet";
import { SnackbarAlert } from "../../components/parts/SnackbarAlert";
import * as _ from "lodash";

interface Props {}

const EditPage: FC<Props> = () => {
  const classes = useStyles();
  const [children, setChild] = useState<Array<any>>([]);
  const [saveSnackBarOpen, setOpen] = useState(false);
  let { set_id } = useParams<{ set_id?: string | undefined }>();
  const dispatch = useDispatch();
  const { hiddenSets } = useSetActions(); // TODO: DeleteSetById
  const { takeIdForSet, filterSet, getEditSets, getSetByKey } = useSetHelpers;
  const set = getSetByKey(useSelector(getEditSets), {
    keyname: "set_id_on_server",
    key: set_id as string,
  });
  const mode = "edit";

  const {
    loading: sg_loading,
    error: sg_error,
    called: sg_called,
    refetch,
  } = useQuery(S_GET_SET, {
    variables: {
      id: Number(set_id),
    },
    onCompleted({ getSet }) {
      let props = { ...getSet, id: takeIdForSet() };
      setChild([
        <ApparatusSet {...props} set_id_on_server={getSet.id} mode={mode} />,
      ]);
    },
  });

  const [
    s_editItems,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_EDIT_ITEMS, {
    onCompleted({ editItems: { res } }) {
      if (res === "Success") {
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
    console.log(set);
    // TODO: submit したら自分を削除（removeSelfOnEditMode）。fetch したデータは全て保持。lazyQuery に変えて、ローカルにデータがあればそれを使って、なければ fetch.
    // TODO: fetch description and note as well
    let jsoned_set = filterSet([set]);
    s_editItems({
      variables: { data: jsoned_set },
    });
  };

  useEffect(() => {
    return () => {
      // maybe do something.
    };
  }, []);

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Edit Set</h2>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
      {!set?.show && (
        <Alert severity="info" className={classes.alertDeleteSetOnEdit}>
          Delete this Set and its items by pressing SAVE EDIT button.
        </Alert>
      )}
      {children.map((child) => child)}
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Icon>arrow_right</Icon>}
            disableRipple
            disableTouchRipple
            onClick={sendItems}
          >
            Save Edit
          </Button>
          <SnackbarAlert isOpen={saveSnackBarOpen} />
        </Grid>
      </Grid>
    </div>
  );
};

export { EditPage as default };
