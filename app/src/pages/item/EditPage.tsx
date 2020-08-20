import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import { useLazyQuery, useMutation, ApolloError } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSetActions } from "../../features/set/setFeatureSlice";
import { useSetHelpers } from "../../features/set/setHelpers";
import { S_GET_ITEM } from "../../api/graphql/itemQueries";
import { S_EDIT_ITEM } from "../../api/graphql/itemQueries";
import { useStyles } from "../../assets/style/item/page.style";
import { Alert } from "@material-ui/lab";
import { ApparatusSet } from "../../components/Item/ApparatusSet";
import { SnackbarAlert } from "../../components/parts/SnackbarAlert";
import { BottomButtonSection } from "../../components/parts/BottomButtonSection";
import * as _ from "lodash";

interface IProps {}

const EditPage: FC<IProps> = () => {
  const classes = useStyles();
  const [children, setChild] = useState<Array<any>>([]);
  const [saveSnackBarOpen, setOpen] = useState(false);
  const { takeIdForSet, filterSet, getEditSets, getSetByKey } = useSetHelpers;
  let { item_id } = useParams<{ item_id?: string | undefined }>();
  const set_id = -item_id!;
  const edit_set_state = useSelector(getEditSets);
  const set = getSetByKey(useSelector(getEditSets), {
    keyname: "set_id_on_server",
    key: set_id,
  });
  const mode = "edit";

  const [s_editItems] = useMutation(S_EDIT_ITEM, {
    onCompleted({ updateItem: { res } }) {
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

  const sendItems = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      let jsoned_set = filterSet([set]);
      s_editItems({
        variables: { data: jsoned_set },
      });
    },
    [set]
  );

  const [
    fetchItem,
    { loading: sg_loading, error: sg_error, called: sg_called, data, refetch },
  ] = useLazyQuery(S_GET_ITEM, {
    variables: {
      id: Number(item_id),
    },
    onCompleted({ getItem }) {
      let items = [
        {
          id: getItem.id,
          type: getItem.type,
          data: getItem.data,
          description: getItem.item_meta.description,
          note: getItem.item_meta.note,
        },
      ];
      let props = { items, id: takeIdForSet() };
      setChild([
        <ApparatusSet {...props} set_id_on_server={-item_id!} mode={mode} />,
      ]);
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  useEffect(() => {
    if (set === undefined) {
      fetchItem();
    } else {
      setChild([<ApparatusSet {...set} mode={mode} />]);
    }
  }, []);

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Edit Item</h2>
      {!set?.show && (
        <Alert severity="info" className={classes.alertDeleteSetOnEdit}>
          Delete this Set and its items by pressing SAVE EDIT button.
        </Alert>
      )}
      {children.map((child) => child)}
      <BottomButtonSection
        nameSave="Save Edit"
        mode={mode}
        handleOnSave={sendItems}
      />
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { EditPage as default };
