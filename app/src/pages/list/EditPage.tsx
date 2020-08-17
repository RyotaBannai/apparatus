import React, {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  FC,
} from "react";
import { useLazyQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_LIST, S_ADD_ADDEES } from "../../api/graphql/listQueries";
import { S_GET_SETS } from "../../api/graphql/setQueries";
import { S_GET_ITEMS } from "../../api/graphql/itemQueries";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { useParams } from "react-router-dom";
import { useStyles } from "../../assets/style/list/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useListActions } from "../../features/list/listFeatureSlice";
import { useListMetaActions } from "../../features/list/listMetaFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";
import { SnackbarAlert } from "../../components/parts/SnackbarAlert";
import SetListTable from "../../components/set/SetListTable";
import { returnData, createData } from "../../pages/set/ListPage";
import {
  AppBar,
  Box,
  Button,
  Grid,
  Icon,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ListEditPageTopName from "../../components/List/ListEditPageTopName";

interface Props {}

const EditPage: FC<Props> = () => {
  const classes = useStyles();
  const [saveSnackBarOpen, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { addateList } = useListActions();
  const {
    addateHoverState,
    updateAddableAddFrom,
    updateAddableTargets,
    addSelectedTarget,
    removeUnSelectedTarget,
  } = useListMetaActions();
  let { list_id } = useParams<{ list_id?: string }>();

  const {
    getEditLists,
    getListByKey,
    getListMeta,
    getHoverStateById,
    takeIdForList,
    getAddableTargets,
    getAddableState,
    getAddableAddFrom,
    getAddableSelected,
  } = useListHelpers;

  const this_list = getListByKey(useSelector(getEditLists), {
    key_name: "id_on_server",
    key: list_id,
  });

  const list_meta = useSelector(getListMeta);
  // const getEditStateByIdHandler = (id: string) =>
  // getHoverStateById(list_meta.hover_states, { id });
  const is_addable = useSelector(getAddableState);
  const add_from = useSelector(getAddableAddFrom);
  const targets = useSelector(getAddableTargets);
  const selected = useSelector(getAddableSelected);

  const onChangeAddableTarget = (e: any) =>
    dispatch(updateAddableAddFrom({ add_from: e.target.value }));

  const [
    fetchList,
    { loading: sg_loading, error: sg_error, data, refetch },
  ] = useLazyQuery(S_GET_LIST, {
    variables: {
      id: String(list_id),
    },
    onCompleted({ getList }) {
      const { id, description, name, targets } = getList;
      dispatch(
        addateList({
          id: takeIdForList(),
          id_on_server: id,
          description,
          name,
          targets,
          mode: "edit",
        })
      );
    },
  });

  let callSnackBarOpenHandler = useCallback(() => setOpen(!saveSnackBarOpen), [
    saveSnackBarOpen,
  ]);

  const getHoverStateByIdHandler = (id: string) =>
    getHoverStateById(list_meta.hover_states, { id });

  const changeHoverState = ({ id, is_hover }: ApparatusList.ListHoverState) =>
    dispatch(
      addateHoverState({
        id,
        is_hover,
      })
    );

  const addSelectedTargetHandler = ({
    id,
    add_to,
  }: {
    id: number;
    add_to: "items" | "sets";
  }) => {
    dispatch(addSelectedTarget({ id, add_to }));
  };

  const removeUnSelectedTargetHandler = ({
    id,
    add_to,
  }: {
    id: number;
    add_to: "items" | "sets";
  }) => {
    dispatch(removeUnSelectedTarget({ id, add_to }));
  };

  const { getCurrentWS } = useWSHelpers;
  const [fetchSet, { refetch: set_refetch }] = useLazyQuery(S_GET_SETS, {
    variables: {
      wsId: Number(getCurrentWS().id),
    },
    onCompleted({ getSets }) {
      dispatch(updateAddableTargets({ targets: getSets }));
    },
  });

  const [fetchItem, { refetch: item_refetch }] = useLazyQuery(S_GET_ITEMS, {
    variables: {
      wsId: Number(getCurrentWS().id),
    },
    onCompleted({ getItems }) {
      dispatch(updateAddableTargets({ targets: getItems }));
    },
  });

  useEffect(() => {
    if (this_list === undefined) {
      fetchList();
    }

    if (targets?.sets.length === 0) {
      fetchSet();
    }

    if (targets?.sets.length === 0) {
      fetchItem();
    }

    changeHoverState({
      id: "list_title",
      is_hover: false,
    });
  }, []);

  const [
    s_add_addees,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_ADD_ADDEES, {
    onCompleted({ res }) {
      setOpen(!saveSnackBarOpen);
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <div>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre> */}
      <pre>{JSON.stringify(this_list, null, 1)}</pre>
      <ListEditPageTopName
        this_list={this_list}
        data={data}
        getHoverStateByIdHandler={getHoverStateByIdHandler}
        changeHoverState={changeHoverState}
        callSnackBarOpenHandler={callSnackBarOpenHandler}
      />
      {is_addable ? (
        <Box>
          <AppBar position="static" className={classes.addableAppBar}>
            <Toolbar variant="dense">
              <Grid container alignItems="center" direction="row" spacing={1}>
                <Grid item>
                  <Typography variant="h6" color="inherit">
                    Add From
                  </Typography>
                </Grid>
                <Grid item>
                  <Select
                    id="type"
                    required
                    variant="outlined"
                    autoWidth
                    defaultValue={add_from ?? "sets"}
                    className={classes.formType}
                    onChange={onChangeAddableTarget}
                  >
                    <MenuItem value="items">Item</MenuItem>
                    <MenuItem value="sets">Set</MenuItem>
                  </Select>
                </Grid>

                {selected[add_from]?.length > 0 ? (
                  <>
                    <Grid item>
                      <Typography variant="h6" color="inherit">
                        {selected[add_from].length + " selected"}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<Icon>arrow_right</Icon>}
                        disableRipple
                        disableTouchRipple
                        onClick={() => {
                          const variables = {
                            id: Number(list_id),
                            addee_type: add_from,
                            addee_ids: selected[add_from],
                          };
                          s_add_addees({
                            variables,
                          });
                        }}
                      >
                        Add
                      </Button>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>
            </Toolbar>
          </AppBar>
          {targets?.sets !== undefined && targets?.sets.length > 0 ? (
            <div>
              <SetListTable
                returnData={returnData}
                createData={createData}
                data={targets?.sets}
                selectable={{
                  is_selectable: true,
                  add: addSelectedTargetHandler,
                  remove: removeUnSelectedTargetHandler,
                  selected,
                }}
              />
            </div>
          ) : (
            <div>No set</div>
          )}
        </Box>
      ) : (
        <></>
      )}

      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { EditPage as default };
