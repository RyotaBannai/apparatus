import React, { useState, useEffect, useRef, SyntheticEvent, FC } from "react";
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
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";

function createData(
  id: number,
  name: string,
  items: Item.Items
): ApparatusSet.createDataType {
  return {
    id,
    name,
    items,
    item_count: items.length,
  };
}

const returnData = (sets: ApparatusSet.Set[]) => {
  let rows: ReturnType<typeof createData>[] = [];
  for (const { id, name, items } of sets) {
    rows = [...rows, createData(id, name, items)];
  }
  return rows;
};

interface Props {}

const EditPage: FC<Props> = () => {
  const classes = useStyles();
  const [saveSnackBarOpen, setOpen] = useState(false);
  const [editSetData, setEditSetData] = useState(false);
  const inputName = useRef(null);
  const inputDescription = useRef(null);
  const dispatch = useDispatch();
  const { addateList } = useListActions();
  const {
    addateHoverState,
    toggleListEditableState,
    toggleListAddableState,
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
    getEdibleState,
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
  const getHoverStateByIdHandler = (id: string) =>
    getHoverStateById(list_meta.hover_states, { id });

  // const getEditStateByIdHandler = (id: string) =>
  // getHoverStateById(list_meta.hover_states, { id });
  const is_editable = useSelector(getEdibleState);
  const is_addable = useSelector(getAddableState);
  const add_from = useSelector(getAddableAddFrom);
  const targets = useSelector(getAddableTargets);
  const selected = useSelector(getAddableSelected);

  const onChangeAddableTarget = (e: any) =>
    dispatch(updateAddableAddFrom({ add_from: e.target.value }));

  const setChange = (newListData: ApparatusList.UpdateSetInput[]) => {
    let payload = Object.assign(
      {
        id: Number(this_list?.id),
        mode: "edit",
      },
      ...newListData.map((keyValue: ApparatusList.UpdateSetInput) => ({
        [keyValue.key]: keyValue.value,
      }))
    );
    dispatch(addateList(payload));
  };

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

  const getValueFromHTMLElement = (
    ref: React.MutableRefObject<string | null>,
    tag_type: "input" | "textarea"
  ) => ((ref.current as unknown) as HTMLElement).querySelector(tag_type)?.value;

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
      {editSetData ? (
        <>
          <Grid container alignItems="center" direction="row" spacing={1}>
            <Grid item className={classes.gridName}>
              <InputLabel htmlFor="name">Name</InputLabel>
              <OutlinedInput
                id="name"
                ref={inputName}
                required
                defaultValue={this_list?.name ?? data?.getList.name ?? ""}
                className={classes.name}
              />
            </Grid>
          </Grid>
          <Grid container alignItems="center" direction="row" spacing={1}>
            <Grid item className={classes.gridDescription}>
              <InputLabel htmlFor="description">Description</InputLabel>
              <TextField
                id="description"
                ref={inputDescription}
                required
                multiline
                rowsMax={4}
                variant="outlined"
                defaultValue={this_list?.description ?? ""}
                className={classes.description}
              />
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            direction="row"
            className={classes.gridButtonArea}
            spacing={1}
          >
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Icon>clear</Icon>}
                disableRipple
                disableTouchRipple
                className={classes.cancelEditButton}
                onClick={() => setEditSetData(!editSetData)}
              >
                Cancel Edit
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                endIcon={<Icon>arrow_right</Icon>}
                disableRipple
                disableTouchRipple
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault();
                  setEditSetData(!editSetData);
                  setOpen(!saveSnackBarOpen);
                  if (inputName === null || inputDescription === null) return;
                  setChange([
                    {
                      key: "name",
                      value: getValueFromHTMLElement(
                        inputName,
                        "input"
                      ) as string,
                    },
                    {
                      key: "description",
                      value: getValueFromHTMLElement(
                        inputDescription,
                        "textarea"
                      ) as string,
                    },
                  ]);

                  // s_save_list_change({
                  //   variables: { ...l_data, id: getCurrentWS().id },
                  // });
                }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid container alignItems="center" direction="row" spacing={1}>
            <Grid item xs={9}>
              <Card
                className={classes.root}
                onMouseEnter={() =>
                  changeHoverState({
                    id: "list_title",
                    is_hover: true,
                  })
                }
                onMouseLeave={() =>
                  changeHoverState({
                    id: "list_title",
                    is_hover: false,
                  })
                }
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {this_list?.name ?? data?.getList.name ?? ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {this_list?.description ?? ""}
                  </Typography>
                </CardContent>
                {getHoverStateByIdHandler("list_title")?.is_hover ? (
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      disableRipple
                      disableTouchRipple
                      onClick={() => {
                        setEditSetData(!editSetData);
                        changeHoverState({
                          id: "list_title",
                          is_hover: false,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  </CardActions>
                ) : (
                  <></>
                )}
              </Card>
            </Grid>
            <Grid item xs={3}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={is_editable}
                      onChange={() =>
                        dispatch(
                          toggleListEditableState({ editable: !is_editable })
                        )
                      }
                      name="editable"
                      color="primary"
                    />
                  }
                  label="Edit"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={is_addable}
                      onChange={() =>
                        dispatch(
                          toggleListAddableState({ is_addable: !is_addable })
                        )
                      }
                      name="editable"
                      color="primary"
                    />
                  }
                  label="Add"
                />
              </FormGroup>
            </Grid>
          </Grid>
          {is_addable ? (
            <Box>
              <AppBar position="static" className={classes.addableAppBar}>
                <Toolbar variant="dense">
                  <Grid
                    container
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
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
        </>
      )}

      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { EditPage as default };
