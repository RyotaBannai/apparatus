import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useLazyQuery, useMutation, ApolloError } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSetHelpers } from "../../features/set/setHelpers";
import { S_GET_SET } from "../../api/graphql/setQueries";
import { S_DELETE_ITEMS } from "../../api/graphql/itemQueries";
import { S_EDIT_ITEMS } from "../../api/graphql/itemQueries";
import { useStyles } from "../../assets/style/item/page.style";
import { Alert } from "@material-ui/lab";
import { ApparatusSet } from "../../components/Item/ApparatusSet";
import { SnackbarAlert } from "../../components/Parts/SnackbarAlert";
import { BottomButtonSection } from "../../components/Parts/BottomButtonSection";
import * as _ from "lodash";

interface Props {}

const EditPage: FC<Props> = () => {
  const classes = useStyles();
  const [children, setChild] = useState<Array<any>>([]);
  const [saveSnackBarOpen, setOpen] = useState(false);
  let { set_id } = useParams<{ set_id?: string | undefined }>();
  const { takeIdForSet, filterSet, getEditSets, getSetByKey } = useSetHelpers;
  const set = getSetByKey(useSelector(getEditSets), {
    keyname: "set_id_on_server",
    key: set_id as string,
  });
  const mode = "edit";

  const [s_editItems] = useMutation(S_EDIT_ITEMS, {
    onCompleted({ updateItems: { res } }) {
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

  const [s_deleteItems] = useMutation(S_DELETE_ITEMS, {
    onCompleted({ deleteItems: { res } }) {
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
    let jsoned_set = filterSet([set]);
    s_editItems({
      variables: { data: jsoned_set },
    });
  };

  const deleteItems = () => {
    s_deleteItems({
      variables: {
        set_id: Number(set_id),
      },
    });
  };

  const [
    fetchSet,
    { loading: sg_loading, error: sg_error, called: sg_called, data, refetch },
  ] = useLazyQuery(S_GET_SET, {
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

  useEffect(() => {
    if (set === undefined) {
      fetchSet();
    } else {
      setChild([<ApparatusSet {...set} mode={mode} />]);
    }
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
      <BottomButtonSection
        mode={mode}
        nameSave="Save Edit"
        nameDelete="Delete Set"
        handleOnSave={sendItems}
        handleOnDelete={deleteItems}
      />
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { EditPage as default };
