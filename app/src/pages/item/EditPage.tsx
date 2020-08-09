import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSetActions } from "../../features/set/setFeatureSlice";
import { useSetHelpers } from "../../features/set/setHelpers";
import { S_GET_SET } from "../../api/graphql/setQueries";
import { S_ADD_ITEMS } from "../../api/graphql/itemQueries";
import { Button, Grid, Icon } from "@material-ui/core";
import { ApparatusSet } from "../../components/Item/ApparatusSet";
import { SnackbarAlert } from "../../components/parts/SnackbarAlert";
import * as _ from "lodash";

interface Props {}

const EditPage: FC<Props> = () => {
  const [children, setChild] = useState<Array<any>>([]);
  const [saveSnackBarOpen, setOpen] = useState(false);
  let { set_id } = useParams<{ set_id?: string | undefined }>();
  const dispatch = useDispatch();
  const { cleanEditSets } = useSetActions(); // TODO: DeleteSetById
  const { takeIdForSet, filterSet, getEditSets, getSetById } = useSetHelpers;
  const sets = getSetById(useSelector(getEditSets), { id: Number(set_id) });

  const {
    loading: sg_loading,
    error: sg_error,
    called: sg_called,
    refetch,
  } = useQuery(S_GET_SET, {
    variables: {
      id: Number(set_id),
    },
    onCompleted({ s_getSet }) {
      let props = { ...s_getSet, id: takeIdForSet() };
      setChild([
        <ApparatusSet
          {...props}
          set_id_on_server={s_getSet.id}
          edit_mode={true}
        />,
      ]);
    },
  });

  const [
    s_addItems,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_ADD_ITEMS, {
    onCompleted({ createItems: { res } }) {
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
    // let jsoned_set = filterSet();
    // TODO: pickOnlyNewItems を作って edit mode と区別、cleanSet も edit mode 以外の items を削除。edit mode では unmount 時に -removeOtherSetOnEditMode- をして、更新用の function には別の submit 関数を使用。submit したら自分を削除する（removeSelfOnEditMode）。いや、全て持っといていい。lazyquery に変えて、ローカルにデータがあればそれを使って、なければ fetch.
    // TODO: fetch description and note as well
    // TODO: change to s_editItems
    // s_addItems({
    //   variables: { data: jsoned_set },
    // });
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
