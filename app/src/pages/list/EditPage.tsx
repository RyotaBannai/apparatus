import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useLazyQuery, useMutation, ApolloError } from "@apollo/client";
import { S_GET_LIST } from "../../api/graphql/listQueries";
import { useParams } from "react-router-dom";
import { useStyles } from "../../assets/style/list/page.style";
import { useDispatch, useSelector } from "react-redux";
import { useListActions } from "../../features/list/listFeatureSlice";
import { useListHelpers } from "../../features/list/listHelpers";
import { SnackbarAlert } from "../../components/parts/SnackbarAlert";
import {
  Button,
  Grid,
  Icon,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@material-ui/core";

interface Props {}
const EditPage: FC<Props> = () => {
  const classes = useStyles();
  const [saveSnackBarOpen, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { addateList } = useListActions();
  let { list_id } = useParams<{ list_id?: string }>();
  const { getEditLists, getListByKey } = useListHelpers;
  const this_list = getListByKey(useSelector(getEditLists), {
    key_name: "id_on_server",
    key: list_id,
  });

  const onChangeName = (e: any) => handleEvent(e, "name");
  const onChangeDescription = (e: any) => handleEvent(e, "description");
  const handleEvent = (e: any, form_name: string) => {
    e.preventDefault();
    setChange(e.target.value, form_name);
  };
  const setChange = (value: string, update_data: string) => {
    dispatch(
      addateList({
        [update_data]: value,
        type: update_data,
        mode: "edit",
      })
    );
  };

  const [
    fetchList,
    { loading: sg_loading, error: sg_error, data, refetch },
  ] = useLazyQuery(S_GET_LIST, {
    variables: {
      id: String(list_id),
    },
  });

  useEffect(() => {
    if (this_list === undefined) {
      fetchList();
    }
  }, []);

  // const [
  //   s_editWorkspace,
  //   { loading: sa_loading, error: sa_error, called: sa_called },
  // ] = useMutation(S_EDIT_WORKSPACE, {
  //   onCompleted({ res }) {
  //     setOpen(!saveSnackBarOpen);
  //   },
  //   onError(error: ApolloError) {
  //     console.log(error);
  //   },
  // });

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Here come list name</h2>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre>
      <pre>{JSON.stringify(this_list, null, 1)}</pre> */}
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item className={classes.gridName}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <OutlinedInput
            id="name"
            required
            defaultValue={this_list?.name}
            className={classes.name}
            onChange={onChangeName}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item className={classes.gridDescription}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <TextField
            id="description"
            required
            multiline
            rowsMax={4}
            variant="outlined"
            defaultValue={this_list?.description ?? ""}
            className={classes.description}
            onChange={onChangeDescription}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            endIcon={<Icon>arrow_right</Icon>}
            disableRipple
            disableTouchRipple
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              // s_editWorkspace({
              //   variables: { ...l_data, id: getCurrentWS().id },
              // });
            }}
          >
            Edit Workspace
          </Button>
        </Grid>
      </Grid>
      <SnackbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};

export { EditPage as default };
